import app from './app'
import { socketChat } from './socket'

let http = require('http')
let server = http.Server(app)

const port = process.env.port || 4200


let socketIO = require('socket.io')
let io = socketIO(server)
socketChat(io)

//
// ─── SERVER START ───────────────────────────────────────────────────────────────
server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
