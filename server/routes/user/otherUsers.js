import { ObjectId } from 'mongodb'

export async function usersNotInGroup(req, res) {
  console.info('GET::otherUsers/:id', req.params.id)
  const userCollection = req.db.collection('user')
  const groupCollection = req.db.collection('group')
 
  try {
    let group = await groupCollection.findOne({ _id: ObjectId(req.params.id) })
    let userIds = group.users.map(user => ObjectId(user))
  
    let otherUsers = await userCollection
      .find({ _id: { $nin: userIds } })
      .toArray()

    res.send(otherUsers)
  } catch (error) {
    console.log(error)
    res.send({status: 'Something went wrong'})
  }
}
