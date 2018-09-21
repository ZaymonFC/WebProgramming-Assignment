import { ReadJSON, WriteJSON } from './data-access/file-handler'
import {
  selectN,
  findItems,
  insertItems,
  updateItems,
  deleteItems,
  insertForeignKey,
  removeForeignKey,
  removeReference,
  deleteCollection
} from './data-access/repository'
import { sanitiseUserObject, sanitiseGroupObject, sanitiseChannelObject } from './sanitizers';

const uuid = require('uuid/v4')
const path = require('path')
let express = require('express')
let app = express()

const dataFiles = {
  UserFile: 'server/data/user.json',
  GroupFile: 'server/data/group.json',
  ChannelFile: 'server/data/channel.json',
}

const uniqueFields = {
  User: ['id', 'username'],
  Group: ['id', 'name'],
  Channel: ['id'],
}

// Setup Middleware and static serving
app.use(express.static(path.join(__dirname, '../dist/sockets')))
app.use(express.json())

// Mongo
let MongoClient = require('mongodb').MongoClient
const dbUrl = 'mongodb://127.0.0.1:27017'

app.use(async function (req, res, next) {
  try {
    let client = await MongoClient.connect(dbUrl, {useNewUrlParser: true})
    const db = client.db('socketChat')
    req.db = db
  
    next()
  } catch (error) {
    console.log('Something went wrong providing a connection to request', error)
  }
})

//
// ─── FILE READERS AND WRITERS ───────────────────────────────────────────────────
//
const readUser = ReadJSON.bind(null, dataFiles.UserFile)
const writeUser = WriteJSON.bind(null, dataFiles.UserFile)

const readGroup = ReadJSON.bind(null, dataFiles.GroupFile)
const writeGroup = WriteJSON.bind(null, dataFiles.GroupFile)

const readChannel = ReadJSON.bind(null, dataFiles.ChannelFile)
const writeChannel = WriteJSON.bind(null, dataFiles.ChannelFile)

import { resetAndSeedDb } from './routes/dbSetup'
import { login } from './routes/user/login';
import { listUsers } from './routes/user/list';
import { findUser } from './routes/user/find';
import { createUser } from './routes/user/create';
import { listGroups } from './routes/group/list';
import { createGroup } from './routes/group/create';

// Seeder Route
app.get('/resetAndSeedDb', async(req, res) => resetAndSeedDb(req, res))

//
// ─── USER ROUTES ────────────────────────────────────────────────────────────────
//

// Logging in
app.get('/login/:username', async (req, res) => login(req, res))
// List
app.get('/user', async (req, res) => listUsers(req, res))
// Find by ID 
app.get('/user/:id', async (req, res) => findUser(req, res))

// Create user
app.post('/user', async (req, res) => createUser(req, res))

// Update
app.patch('/user/:id', async (req, res) => {
  console.log('Updating user')
  const changes = req.body

  if (!changes) {
    res.send(400)
    return
  }

  const selector = {
    id: req.params.id
  }

  const updateUser = updateItems.bind(null, readUser, writeUser, selector)

  await updateUser(changes)
  res.send({status: "OK"})
})

// Delete
app.delete('/user/:id', async (req, res) => {
  console.log('Deleting user')

  const id = req.params.id
  if (!id) {
    res.sendStatus(400)
    return
  }

  const deleteUser = deleteItems.bind(null, readUser, writeUser)

  await deleteUser({
    id: id
  })

  // Remove all references to the user from groups
  const removeUserReferenceGroups = removeReference.bind(null, readGroup, writeGroup)
  await removeUserReferenceGroups({
    key: 'users',
    value: id
  })
  
  // Remove all regerences to the user from channels
  const removeUserReferenceChannels = removeReference.bind(null, readChannel, writeChannel)
  await removeUserReferenceChannels({
    key: 'users',
    value: id
  })

  res.send({ status: "OK" })
})

app.get('/otherUsers/:id', async (req, res) => {
  console.log('Fetching users that aren\'t in group: ' + req.params.id)

  // Fetch the group
  const findGroups = findItems.bind(null, readGroup)
  const items = await findGroups({ id: req.params.id })
  if (!items) {
    res.send({status: FAILED})
    return
  }
  const group = items.shift()
  
  const selectUsers = selectN.bind(null, readUser)
  let users = await selectUsers(100)
  if (group.users) {
    users = users.filter(user => !group.users.includes(user.id))
  }

  res.send(users)
})

//
// ─── GROUP CRUD ─────────────────────────────────────────────────────────────────
// Get Groups
app.get('/group', async (req, res) => listGroups(req, res))

app.get('/group/:id', async (req, res) => {
  const findGroup = findItems.bind(null, readGroup)
  const findUsers = findItems.bind(null, readUser)
  const findChannels = findItems.bind(null, readChannel)

  const items = await findGroup({
    id: req.params.id
  })

  if (!items) {
    res.send('not-found')
    return
  }

  let group = items.shift()
  // Add nested user objects
  if (group.users) {
    group.users = await Promise.all(group.users.map(async (id) => {
      let user = await findUsers({id: id})
      return user.shift()
    }))
  }

  // Find Associated Channels
  if(group.channels) {
    group.channels = await Promise.all(group.channels.map(async (id) => {
      let channel = await findChannels({id: id})
      return channel.shift()
    }))
  }
  res.json(group)
})

// Create Group
app.post('/group', async (req, res) => createGroup(req, res))

// Update Group
app.patch('/group/:id', async (req, res) => {
  console.log('Updating Group')
  const changes = req.body
  const selector = {
    id: req.params.id
  }

  const updateGroup = updateItems.bind(null, readGroup, writeGroup, selector)
  await updateGroup(changes)
  res.send("OK")
})

// Delete
app.delete('/group/:id', async (req, res) => {
  console.log('Deleting Group')

  // Get the group
  const findGroup = findItems.bind(null, readGroup)
  const items = await findGroup({ id: req.params.id })
  const group = items.shift()
  console.log(group)

  const deleteGroup = deleteItems.bind(null, readGroup, writeGroup)

  await deleteGroup({
    id: group.id
  })

  // Delete all channels that were members of the group
  const deleteChannels = deleteCollection.bind(null, readChannel, writeChannel)
  console.log('Channels', group.channels)
  if (group.channels) {
    await deleteChannels(group.channels)
  }

  res.send({status: "OK"})
})


// Create Channel
app.put('/channel', async (req, res) => {
  const channel = sanitiseChannelObject(req.body)
  const groupId = req.body.groupId

  console.log(req.body)

  if (channel == null) {
    res.send('failed')
    console.log('[Channel] Sanitize Failed')
    return
  }
  channel.id = uuid()

  const insertChannel = insertItems.bind(null, readChannel, writeChannel, uniqueFields.Channel)
  try {
    await insertChannel(channel)
  } catch (error) {
    if (error.message === 'not-unique') { 
      res.send('not-unique')
    }
    return
  }

  // Update the referenced group to contain a reference to the channel
  const selector = { id: groupId }
  const insertFKToGroup = insertForeignKey.bind(null, readGroup, writeGroup, selector)

  await insertFKToGroup({
    key: 'channels',
    value: channel.id
  })

  console.log('Created Channel')
  res.json(channel)
})

// Delete Channel and All References To It
app.delete('/channel/:id', async (req, res) => {
  console.log('Deleting Channel')
  // Remove the channel entity
  const deleteChannel = deleteItems.bind(null, readChannel, writeChannel)
  await deleteChannel({
    id: req.params.id
  })

  // Clear the associated foreign keys from all groups
  const removeGroupChannelKey = removeReference.bind(null, readGroup, writeGroup)
  await removeGroupChannelKey({
    key: 'channels',
    value: req.params.id
  })

  res.send({status: 'OK'})
})

// Add or remove user from group
app.patch('/group/:id/user', async (req, res) => {
  console.log(req.body.method + ' user to group' + req.params.id)
  const userId = req.body.id

  if (req.body.method === 'add-user') {
    const addGroupFK = insertForeignKey.bind(null, readGroup, writeGroup, { id: req.params.id })
    await addGroupFK({
      key: 'users',
      value: userId
    })
    res.send({status: "OK"})
    return
  } else if (req.body.method === 'remove-user') {
    // Remove ref to user from group
    const removeGroupFK = removeForeignKey.bind(null, readGroup, writeGroup, { id: req.params.id })
    await removeGroupFK({
      key: 'users',
      value: userId
    })

    // Remove ref to user from all the groups channels
    res.send({status: "OK"})
    return
  }

  res.send("FAIL")
  return
})

app.get('/channel/:id', async (req, res) => {
  const channelId = req.params.id
  const findChannels = findItems.bind(null, readChannel)

  const items = await findChannels({ id: channelId })
  if (!items) {
    res.sendStatus(404)
    return
  }
  const channel = items.shift()

  // Populate users from channel
  if (channel.users) {
    const findUsers = findItems.bind(null, readUser)
    channel.users = await Promise.all(channel.users.map(async (userId) => {
      const items = await findUsers({ id: userId })
      return items.shift()
    }))
  }

  res.send(channel)
})

// Add or remove users from a channel
app.patch('/channel', async (req, res) => {
  const channelId = req.body.channelId
  const userId = req.body.userId
  const method = req.body.method

  if (!channelId || !userId || !method) {
    res.sendStatus(400)
    return
  }
  
  if (method === 'add-user') {
    const addChannelFK = insertForeignKey.bind(null, readChannel, writeChannel, { id: channelId })
    await addChannelFK({
      key: 'users',
      value: userId
    })

    res.send({status: "OK"})
    return
  } else if (method === 'remove-user') {
    const removeChannelFK = removeForeignKey.bind(null, readChannel, writeChannel, { id: channelId })
    await removeChannelFK({
      key: 'users',
      value: userId
    })

    res.send({status: "OK"})
    return
  } else {
    res.sendStatus(400)
    return
  }
})

module.exports = app