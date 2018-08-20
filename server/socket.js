module.exports = (app, io) => {
    console.log("Server Socket Initialised")

    // Respond to a connection request
    io.on('connection', (socket) => {
        console.log('user connected')

        // Handle disconnection of request
        socket.on('disconnect', () => {
            console.log('user disconnected')
        })

        // Respond to getting a new message
        socket.on('add-message', (message) => {
            io.emit('message', {
                type: 'message',
                text: message
            })
        })
    })
}