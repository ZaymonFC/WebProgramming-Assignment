const path = require('path')
let express = require('express')
let app = express()

let http = require('http')
let server = http.Server(app)

let socketIO = require('socket.io')
let io = socketIO(server)

const port = process.env.port || 4200

// Setup Middleware and static serving
app.use(express.static(path.join(__dirname, '../dist/sockets')))

require('./socket.js')(app, io)

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})