import { ObjectId } from 'mongodb'

export async function deleteGroup(req, res) {
  console.info('[DELETE::group/:id]', req.params.id)
  const groupCollection = req.db.collection('group')
  const channelCollection = req.db.collection('channel')
  const chatCollection = req.db.collection('chat')

  try {
    const selector = { _id: ObjectId(req.params.id) }
    let group = await groupCollection.findOne(selector)

    if (group.channels.length > 0) {
      const channelIds = group.channels.map(channel => ObjectId(channel))
      let r = await channelCollection.deleteMany({ _id: { $in: channelIds } })
      if (r.deletedCount !== channelIds.length) throw 'Error deleting channels'

      let plainIds = group.channels.map(element => element.toString())
      await chatCollection.deleteMany({ channelId: { $in: plainIds } })
    }

    let r = await groupCollection.deleteOne(selector)
    if (r.deletedCount !== 1) throw 'Error deleting group'

    res.send({ status: 'OK' })
  } catch (error) {
    console.log(error)
    res.send({ status: 'Something went wrong' })
  }
}
