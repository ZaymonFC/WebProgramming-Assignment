export async function login(req, res) {
  console.info(
    '[POST::login]',
    `username: ${req.body.username} password: ${req.body.password}`
  )

  try {
    let collection = req.db.collection('user')
    let user = await collection.findOne({
      username: req.body.username,
      password: `${req.body.password}`
    })
    console.log(user)

    if (user) {
      res.send(user)
    } else {
      res.send({ status: 'Incorrect username or password' })
    }
  } catch (error) {
    console.log(error)
    res.send({ status: 'Something went wrong' })
  }
}
