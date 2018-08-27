import { ReadJSON, WriteJSON } from './data-access/file-handler'
import {
  selectN,
  findItems,
  insertItems,
  updateItems,
  deleteItems
} from './data-access/repository'
import { sanitiseUserObject } from './sanitizers';

const uuid = require('uuid/v4')
const path = require('path')
let express = require('express')
let app = express()

const dataFiles = {
  userFile: 'server/data/user.json'
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

// List
app.post('/user', async (req, res) => {
  console.info('Requested top users')
  const readUserFile = ReadJSON.bind(null, dataFiles.userFile)
  const selectNUsers = selectN.bind(null, readUserFile)

  const users = await selectNUsers(100)
  res.json(users)
})

// Find by ID 
app.post('/user/:id', async (req, res) => {
  console.info('Requested user: ', req.params.id)

  const readUserFile = ReadJSON.bind(null, dataFiles.userFile)
  const selectUser = findItems.bind(null, readUserFile)

  const selector = {
    id: req.params.id
  }

  const user = await selectUser(selector)
  res.json(user[0])
})

// Create
app.put('/user', async (req, res) => {
  console.log('Creating user')
  const user = sanitiseUserObject(req.body)
  if (user == null) {
    res.sendStatus(400)
    res.end()
    return
  }
  user.id = uuid()
  
  const writeUserFile = WriteJSON.bind(null, dataFiles.userFile)
  const insertUser = insertItems(null, writeUserFile)

  await insertUser(user)
  res.sendStatus(200).send("OK")
})


//
// ─── SERVER START ───────────────────────────────────────────────────────────────
server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})


