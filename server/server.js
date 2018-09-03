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

let http = require('http')
let server = http.Server(app)

let socketIO = require('socket.io')
let io = socketIO(server)

const port = process.env.port || 4200

// Setup Middleware and static serving
app.use(express.static(path.join(__dirname, '../dist/sockets')))
app.use(express.json())

require('./socket.js')(app, io)

//
// ─── FILE READERS AND WRITERS ───────────────────────────────────────────────────
//
const readUser = ReadJSON.bind(null, dataFiles.UserFile)
const writeUser = WriteJSON.bind(null, dataFiles.UserFile)

const readGroup = ReadJSON.bind(null, dataFiles.GroupFile)
const writeGroup = WriteJSON.bind(null, dataFiles.GroupFile)

const readChannel = ReadJSON.bind(null, dataFiles.ChannelFile)
const writeChannel = WriteJSON.bind(null, dataFiles.ChannelFile)

//
// ─── USER ROUTES ────────────────────────────────────────────────────────────────
// Logging in
app.get('/login/:username', async (req, res) => {
  console.info('Attempting Log In')
  
  const findUser = findItems.bind(null, readUser)
  const user = await findUser({
    username: req.params.username
  })

  if (user) {
    res.send(user.shift())
  } else {
    res.send(undefined)
  }
})

// List
app.get('/user', async (req, res) => {
  console.info('Requested top users')
  const selectNUsers = selectN.bind(null, readUser)

  const users = await selectNUsers(100)
  res.json(users)
})

// Find by ID 
app.get('/user/:id', async (req, res) => {
  console.info('Requested user: ', req.params.id)

  const selectUser = findItems.bind(null, readUser)
  const selector = {
    id: req.params.id
  }
  const user = await selectUser(selector)

  res.json(user.shift())
})

// Create user
app.post('/user', async (req, res) => {
  console.log('Creating user')
  const user = sanitiseUserObject(req.body)
  if (user == null) {
    res.send(null)
    return
  }
  user.id = uuid()
  
  const insertUser = insertItems.bind(null, readUser, writeUser, uniqueFields.User)

  try {
    await insertUser(user)
  } catch (e) {
    if (e.message === 'not-unique') {
      res.send("not-unique")
      return
    }
  }
  res.send(user)
})

// Update
app.patch('/user/:id', async (req, res) => {
  console.log('Updating user')
  const changes = req.body
  const selector = {
    id: req.params.id
  }

  const updateUser = updateItems.bind(null, readUser, writeUser, selector)

  await updateUser(changes)
  res.send("OK")
})

const entities = ['User', 'Group']

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
    id: req.params.id
  })

  // Remove all references to the user from groups
  const removeUserReferenceGroups = removeReference.bind(null, readGroup, writeGroup)
  await removeUserReferenceGroups({
    id: 
  })
  
  // Remove all regerences to the user from channels
  const removeUserReferenceChannels = removeReference.bind(null, readChannel, writeChannel)

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
app.get('/group', async (req, res) => {
  const selectNGroups = selectN.bind(null, readGroup)

  const groups = await selectNGroups(100)
  res.send(groups)
})

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
app.post('/group', async (req, res) => {
  console.log('Creating group')
  const group = sanitiseGroupObject(req.body)
  if (group == null) {
    res.sendStatus(400)
  }
  group.id = uuid()

  const insertGroup = insertItems.bind(null, readGroup, writeGroup, uniqueFields.Group)

  try {
    await insertGroup(group)
    res.send(group)
  } catch (e) {
    if (e.message === 'not-unique') {
      res.send('not-unique')
      return
    }
  }
})

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
    deleteChannels(group.channels)
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
    const removeGroupFK = removeForeignKey.bind(null, readGroup, writeGroup, { id: req.params.id })
    await removeGroupFK({
      key: 'users',
      value: userId
    })
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


//
// ─── SERVER START ───────────────────────────────────────────────────────────────
server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
