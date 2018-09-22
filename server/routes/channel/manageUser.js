import { ObjectId } from 'mongodb'

export async function manageChannelUser(req, res) {
  console.log('PATCH::channel', req.body)

  const channelCollection = req.db.collection('channel')
  const selector = { _id: ObjectId(req.body.channelId) }
  const userId = ObjectId(req.body.userId)
  const method = req.body.method

  try {
    if (method === 'add-user') {
      await channelCollection.updateOne(selector, { $addToSet: { users: userId } })
      res.send({ status: 'OK' })
      return
    } else if (req.body.method === 'remove-user') {
      await channelCollection.updateOne(selector, { $pull: { users: userId } })
      res.send({ status: 'OK' })
    }
  } catch (error) {
    console.log(error)
    res.send({ status: 'Something went wrong' })
  }
}
