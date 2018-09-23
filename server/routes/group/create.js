import { sanitiseGroupObject } from '../../sanitizers'

export async function createGroup(req, res) {
  console.log('[POST::Group] (Create)')

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
    if (e.code === 11000) {
      console.log(e.errmsg)
      res.send({status: 'not-unique'})
    }
    else
    {
      console.log(e)
      res.send({status: 'Something went wrong'})
    }
  }
}