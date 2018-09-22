import { sanitiseChannelObject } from '../../sanitizers'
import { ObjectId } from 'mongodb'

export async function createChannel(req, res) {
  console.info('POST::channel')
  const channelCollection = req.db.collection('channel')
  const groupCollection = req.db.collection('group')

  const channel = sanitiseChannelObject(req.body)
  const groupId = req.body.groupId

  if (channel == null) {
    res.send({ status: 'Something went wrong' })
    console.log('[Channel] Sanitize Failed')
    return
  }

  try {
    let result = await channelCollection.insertOne(channel)

    const selector = { _id: ObjectId(groupId) }
    await groupCollection.updateOne(selector, {
      $addToSet: { channels: channel._id }
    })

    res.send(result.ops.shift())
  } catch (error) {
    if (error.code === 11000) {
      console.log('Channel Not Unique')
      res.send({ status: 'not-unique' })
    } else {
      console.log(error)
      res.send({ status: 'Something went wrong' })
    }
  }
}
