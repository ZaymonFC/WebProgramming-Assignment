import { ReadJSON, WriteJSON } from './data-access/file-handler'
import {
  selectN,
  findItems,
  insertItems,
  updateItems,
  deleteItems
} from './data-access/repository'
import { readJsonConfigFile } from 'typescript';

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

require('./socket.js')(app, io)

app.post('/user', async (req, res) => {
  const readUserFile = ReadJSON.bind(null, dataFiles.userFile)
  const selectNUsers = selectN.bind(null, readUserFile)

  const users = await selectNUsers(100)
  res.json(users)
})

app.post('/user/:id', async (req, res) => {
  console.info('Requested user: ', req.params.id)

  const readUserFile = ReadJSON.bind(null, dataFiles.userFile)
  const selectUser = findItems.bind(null, readUserFile)

  const selector = {
    id: parseInt(req.params.id)
  }

  const user = await selectUser(selector)
  res.json(user)
})

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
