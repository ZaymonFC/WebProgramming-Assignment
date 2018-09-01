import { ReadJSON, WriteJSON } from './data-access/file-handler'
import {
  selectN,
  findItems,
  insertItems,
  updateItems,
  deleteItems
} from './data-access/repository'
import { sanitiseUserObject, sanitiseGroupObject } from './sanitizers';

const uuid = require('uuid/v4')
const path = require('path')
let express = require('express')
let app = express()

const dataFiles = {
  UserFile: 'server/data/user.json',
  GroupFile: 'server/data/group.json'
}

const uniqueFields = {
  User: ['id', 'username'],
  Group: ['id', 'name']
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
// ─── USER ROUTES ────────────────────────────────────────────────────────────────
const readUserFile = ReadJSON.bind(null, dataFiles.UserFile)
const writeUserFile = WriteJSON.bind(null, dataFiles.UserFile)

// Logging in
app.get('/login/:username', async (req, res) => {
  console.info('Attempting Log In')
  
  // PA
  const findUser = findItems.bind(null, readUserFile)
  const user = await findUser({
    username: req.params.username
  })

  if (user.length == 0) {
    res.send(undefined)
  } else {
    res.send(user[0])
  }
})

// List
app.get('/user', async (req, res) => {
  console.info('Requested top users')
  const selectNUsers = selectN.bind(null, readUserFile)

  const users = await selectNUsers(100)
  res.json(users)
})

// Find by ID 
app.get('/user/:id', async (req, res) => {
  console.info('Requested user: ', req.params.id)

  const selectUser = findItems.bind(null, readUserFile)
  const selector = {
    id: req.params.id
  }
  const user = await selectUser(selector)

  res.json(user[0])
})

// Create
app.post('/user', async (req, res) => {
  console.log('Creating user')
  const user = sanitiseUserObject(req.body)
  if (user == null) {
    res.send(null)
    return
  }
  user.id = uuid()
  
  // Partial Application
  const insertUser = insertItems.bind(null, readUserFile, writeUserFile, uniqueFields.User)

  try {
    await insertUser(user)
  } catch (e) {
    if (e.message === 'not-unique') {
      res.send("not-unique")
      return
    }
  }
  res.send()
})

// Update
app.patch('/user/:id', async (req, res) => {
  console.log('Updating user')
  const changes = req.body
  const selector = {
    id: req.params.id
  }

  // Partial Application
  const updateUser = updateItems.bind(null, readUserFile, writeUserFile, selector)

  await updateUser(changes)
  res.send("OK")
})

const entities = ['User', 'Group']

// Update
app.patch('/user/:id', async (req, res) => {
  console.log('Updating user')
  const changes = req.body
  const selector = {
    id: req.params.id
  }

  // Partial Application
  const updateUser = updateItems.bind(null, readUserFile, writeUserFile, selector)

  await updateUser(changes)
  res.send("OK")
})

// Delete
app.delete('/user/:id', async (req, res) => {
  console.log('Deleting user')

  // Partial Application
  const deleteUser = deleteItems.bind(null, readUserFile, writeUserFile)

  await deleteUser({
    id: req.params.id
  })

  res.send("OK")
})

//
// ─── GROUP CRUD ─────────────────────────────────────────────────────────────────
//
const readGroupFile = ReadJSON.bind(null, dataFiles.GroupFile)
const writeGroupFile = WriteJSON.bind(null, dataFiles.GroupFile)

// Get Groups
app.get('/group', async (req, res) => {
  // Partial Application
  const selectNGroups = selectN.bind(null, readGroupFile)

  const groups = await selectNGroups(100)
  res.send(groups)
})

app.get('/group/:id', async (req, res) => {
  // PA
  const findGroup = findItems.bind(null, readGroupFile)

  const group = await findGroup({
    id: req.params.id
  })
  res.json(group[0])
})

// Create Group
app.post('/group', async (req, res) => {
  console.log('Creating group')
  const group = sanitiseGroupObject(req.body)
  if (group == null) {
    res.sendStatus(400)
  }
  group.id = uuid()

  const uniqueFields = ['id', 'name']
  const insertGroup = insertItems.bind(null, readGroupFile, writeGroupFile, uniqueFields)

  try {
    await insertGroup(group)
  } catch (e) {
    if (e.message === 'not-unique') {
      res.send('not-unique')
      return
    }
  }
  res.send(group.id)
})

// Update
app.patch('/group/:id', async (req, res) => {
  console.log('Updating Group')
  const changes = req.body
  const selector = {
    id: req.params.id
  }

  // Partial Application
  const updateGroup = updateItems.bind(null, readGroupFile, writeGroupFile, selector)

  await updateGroup(changes)
  res.send("OK")
})

// Delete
app.delete('/group/:id', async (req, res) => {
  console.log('Deleting Group')

  // Partial Application
  const deleteGroup = deleteItems.bind(null, readGroupFile, writeGroupFile)

  await deleteGroup({
    id: req.params.id
  })

  res.send("OK")
})

//
// ─── SERVER START ───────────────────────────────────────────────────────────────
server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})


