export async function listUsers(req, res) {
  console.info('[GET::user]')
  let collection = req.db.collection('user')
  let users = await collection.find().limit(100).toArray()

  res.json(users)
}
