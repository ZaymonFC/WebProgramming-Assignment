import { ObjectId } from 'mongodb'

export async function findChannel(req, res) {
  console.info('GET::channel/:id', req.params.id)
  const collection = req.db.collection('channel')

  let channel = await collection.findOne({ _id: req.params.id })

  if (channel == null) {
    res.send(null)
    return
  }
  
  // Populate users
  const usersIds = channel.users.map(element => ObjectId(element))
  channel.users = await collection.find({_id: { $in: usersIds}})

  res.send(channel)
}