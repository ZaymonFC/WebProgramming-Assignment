export async function listGroups(req, res) {
  console.log('[GET::group]')

  const collection = req.db.collection('group')
  const groups = await collection
    .find()
    .limit(100)
    .toArray()

  res.send(groups)
}