import { ObjectId } from 'mongodb'

export async function manageGroupUser(req, res) {
  console.log(
    'PATCH::group/:id/user ',
    `\n Method: Group: ${req.params.id} ${req.body.method}`
  )

  const groupCollection = req.db.collection('group')
  const selector = { _id: ObjectId(req.params.id) }
  const userId = ObjectId(req.body.id)

  try {
    if (req.body.method === 'add-user') {
      await groupCollection.updateOne(selector, { $addToSet: { users: userId } })
      res.send({ status: 'OK' })
    } else if (req.body.method === 'remove-user') {
      await groupCollection.updateOne(selector, { $pull: { users: userId } })
      res.send({ status: 'OK' })
    }
  } catch (error) {
    console.log(error)
    res.send({ status: 'Something went wrong' })
  }
}
