import { ObjectId } from 'mongodb'

export async function deleteUser(req, res) {
  console.info('DELETE::user/:id', `id: ${req.params.id}`)
  const userCollection = req.db.collection('user')
  const groupCollection = req.db.collection('group')
  const channelCollection = req.db.collection('channel')

  const userId = ObjectId(req.params.id)
  const plainId = req.params.id
  const selector = { _id: userId }

  try {
    // Delete the user
    let r = await userCollection.deleteOne(selector)
    if (r.deletedCount !== 1) throw 'Error deleting user'

    // Remove References to the user
    r = await groupCollection.update({}, { $pull: { users: plainId } })
    r = await channelCollection.update({}, { $pull: { users: plainId } })

    res.send({ status: 'OK' })
  } catch (error) {
    console.log(error)
    res.send({ status: 'Something went wrong' })
  }
}
