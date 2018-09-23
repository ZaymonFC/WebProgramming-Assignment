export async function login(req, res) {
  console.info('[GET::login/:username]', `username: ${req.params.username}`)
  
  let collection = req.db.collection('user')
  let user = await collection.findOne({ username: req.params.username })
  console.log(user)

  if (user) {
    res.send(user)
  } else {
    res.send(undefined)
  }
}
