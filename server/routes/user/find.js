export async function findUser(req, res) {
  console.info('GET::user/:id', `id: ${ req.params.id }`)

  let collection = req.db.collection('user')
  let user = collection.findOne({_id: req.params.id})

  res.json(user)
}