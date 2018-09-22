import { resetAndSeedDb } from './routes/dbSetup'
import { login } from './routes/user/login'
import { listUsers } from './routes/user/list'
import { findUser } from './routes/user/find'
import { createUser } from './routes/user/create'
import { listGroups } from './routes/group/list'
import { createGroup } from './routes/group/create'
import { findChannel } from './routes/channel/find'
import { updateUser } from './routes/user/update'
import { deleteUser } from './routes/user/delete'
import { usersNotInGroup } from './routes/user/otherUsers'
import { deleteGroup } from './routes/group/delete'
import { findGroup } from './routes/group/find'
import { createChannel } from './routes/channel/create'
import { deleteChannel } from './routes/channel/delete'
import { manageGroupUser } from './routes/group/manageUser'
import { manageChannelUser } from './routes/channel/manageUser';

const path = require('path')
let express = require('express')
let app = express()

// Setup static serving
app.use(express.static(path.join(__dirname, '../dist/sockets')))
app.use(express.json())

// Mongo Setup
let MongoClient = require('mongodb').MongoClient
const dbUrl = 'mongodb://127.0.0.1:27017'

// Add database connection to every request
app.use(async function (req, res, next) {
  try {
    let client = await MongoClient.connect(dbUrl, {useNewUrlParser: true})
    const db = client.db('socketChat')
    req.db = db
  
    next()
  } catch (error) {
    console.log('Something went wrong providing a connection to request: ', error)
  }
})

// Seeder Route
app.get('/resetAndSeedDb', async(req, res) => resetAndSeedDb(req, res))

// --- User -------------------------------------
app.get('/login/:username', async (req, res) => login(req, res))
app.get('/user', async (req, res) => listUsers(req, res))
app.get('/user/:id', async (req, res) => findUser(req, res))
app.get('/otherUsers/:id', async (req, res) => usersNotInGroup(req, res))
app.post('/user', async (req, res) => createUser(req, res))
app.patch('/user/:id', async (req, res) => updateUser(req, res))
app.delete('/user/:id', async (req, res) => deleteUser(req, res))

// --- Group ------------------------------------
app.get('/group', async (req, res) => listGroups(req, res))
app.get('/group/:id', async (req, res) => findGroup(req, res))
app.post('/group', async (req, res) => createGroup(req, res))
app.delete('/group/:id', async (req, res) => deleteGroup(req, res))
app.patch('/group/:id/user', async (req, res) => manageGroupUser(req, res))

// --- Channel ----------------------------------
app.put('/channel', async (req, res) => createChannel(req, res))
app.delete('/channel/:id', async (req, res) => deleteChannel(req, res))
app.get('/channel/:id', async (req, res) => findChannel(req, res))
app.patch('/channel', async (req, res) => manageChannelUser(req, res))

module.exports = app