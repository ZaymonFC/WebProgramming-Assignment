import { ObjectId } from 'mongodb'

export async function findGroup(req, res) {
  console.log('GET::group/:id', req.params.id)

  const groupCollection = req.db.collection('group')
  const userCollection = req.db.collection('user')
  const channelCollection = req.db.collection('channel')
  
  try {
    let group = await groupCollection.findOne({ _id: ObjectId(req.params.id) })
  
    let userIds = group.users.map(user => ObjectId(user))
    group.users = await userCollection.find({ _id: { $in: userIds } })
  
    let channelIds = group.channels.map(channel => ObjectId(channel))
    group.channels = await channelCollection.find({ _id: { $in: channelIds } })

    res.send(group)    
  } catch (error) {
    console.log(error)
    res.send({status: 'Something went wrong.'})
  }
}
