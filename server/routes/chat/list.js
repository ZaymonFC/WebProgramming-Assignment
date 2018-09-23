export async function getMessages(req, res) {
  console.log('GET::chat/:id', req.params.id)
  const channelId = req.params.id
  const chatCollection = req.db.collection('chat')

  try {
    const messages = await chatCollection
      .find({ channelId: channelId })
      .sort({ timeStamp: 1 })
      .toArray()
  
    res.send(messages)
  } catch (error) {
    console.log(error)
    res.send({status: 'Something went wrong'})
  }
}
