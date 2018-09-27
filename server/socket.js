export async function socketChat(io) {
  let MongoClient = require('mongodb').MongoClient
  try {
    const dbUrl = 'mongodb://127.0.0.1:27017'
    let client = await MongoClient.connect(
      dbUrl,
      { useNewUrlParser: true }
    )
    const db = client.db('socketChat')

    sockets(io, db)
  } catch (error) {
    console.log(
      'Something went wrong providing a db connection to socket chat: ',
      error
    )
  }
}

async function sockets(io, db) {
  console.log('Server Socket Initialised')
  const collection = db.collection('chat')

  // Respond to a connection request
  io.on('connection', socket => {
    let connectionInfo = {}
    console.log("user connected")

    socket.on('enter-channel', connectionRequest => {
      console.log('Enter Channel:', connectionRequest)
      enterChatroom(socket, connectionRequest)
      createConnectionInfo(connectionInfo, connectionRequest);
      greetUser(connectionInfo, io, 'connected')
    })

    // Handle disconnection of request
    socket.on('disconnect', () => {
      greetUser(connectionInfo, io, 'disconnected');
    })

    // Respond to getting a new message
    socket.on('add-message', async (message) => {
      // Insert the message into the DB
      await persistMessage(collection, message);
      io.in(message.channelId).emit('message', message)
    })
  })
}

async function persistMessage(collection, message) {
  let r = await collection.insertOne(message);
  if (r.insertedCount !== 1)
    throw 'Error storing message in database';
}

function createConnectionInfo(connectionInfo, connectionRequest) {
  connectionInfo.channel = connectionRequest.channel;
  connectionInfo.username = connectionRequest.username;
}

function greetUser(connectionInfo, io, message) {
  // console.log(`[SOCKET] ${connectionInfo.username} has ${message}.`);
  const serverMessage = {
    userId: 'SERVER',
    channelId: connectionInfo.channel,
    type: 'text',
    text: `[Server] - ${connectionInfo.username} has ${message}.`,
    photoId: null,
    timeStamp: Date.now()
  };
  io.in(connectionInfo.channel).emit('message', serverMessage);
}

function enterChatroom(socket, connectionRequest) {
  console.log('[SOCKET] User entered channel:', connectionRequest.channel)
  socket.join(connectionRequest.channel)
}
