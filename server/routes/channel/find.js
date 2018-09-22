import { ObjectId } from 'mongodb'

export async function findChannel(req, res) {
  console.info('GET::channel/:id', req.params.id)
  const channelCollection = req.db.collection('channel')
  const userCollection = req.db.collection('user')

  let channel = await channelCollection.findOne({ _id: ObjectId(req.params.id) })

  if (channel == null) {
    res.send(null)
    return
  }

  // Populate users
  const usersIds = channel.users.map(element => ObjectId(element))
  channel.users = await userCollection.find({ _id: { $in: usersIds } }).toArray()

  res.send(channel)
}
