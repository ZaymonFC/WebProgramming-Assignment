import { ObjectId } from 'mongodb'

export async function updateUser(req, res) {
  console.info('PATCH::user')
  const collection = req.db.collection('user')

  let changes = req.body

  if (!changes) {
    console.log('No changes defined')
    res.send({ status: 'No changes defined' })
    return
  }

  console.log(req.params.id, changes, ObjectId(req.params.id))

  try {
    let r = await collection.updateOne(
      { _id: ObjectId(req.params.id) },
      { $set: changes }
    )
    if (r.matchedCount !== 1 || r.modifiedCount !== 1) {
      throw 'No document matched or updated'
    }
    res.send({ status: 'OK' })
  } catch (error) {
    console.log(error)
    res.send({ status: 'Something went wrong.' })
  }
}
