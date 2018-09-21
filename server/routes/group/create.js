import { sanitiseGroupObject } from '../../sanitizers'

export async function createGroup(req, res) {
  console.log('POST::Group (Create)')

  const group = sanitiseGroupObject(req.body)
  if (group == null) {
    res.sendStatus(400)
  }

  const collection = req.db.collection('group')
  try {
    let createdGroup = await collection.insertOne(group)

    // Send the created Group
    res.send(createdGroup.ops.shift())
  } catch (e) {
    console.log(e)
  }
}