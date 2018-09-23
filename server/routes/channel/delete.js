import { ObjectId } from 'mongodb'

export async function deleteChannel(req, res) {
  console.info('[DELETE::channel/:id]', req.params.id)

  const channelCollection = req.db.collection('channel')
  const groupCollection = req.db.collection('group')
  const selector = { _id: ObjectId(req.params.id) }

  try {
    const channel = await channelCollection.findOne(selector)
    const groupId = channel.groupId

    let r = await channelCollection.deleteOne(selector)
    if (r.deletedCount !== 1) throw 'Error deleting channel'

    await groupCollection.updateOne(
      { _id: ObjectId(groupId) },
      { $pull: { channels: ObjectId(channel._id) } }
    )

    res.send({ status: 'OK' })
  } catch (error) {
    console.log(error)
    res.send({ status: 'Something went wrong' })
  }
}
