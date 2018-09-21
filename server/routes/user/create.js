import { sanitiseUserObject } from '../../sanitizers'

export async function createUser(req, res) {
  console.log('POST::user')
  const user = sanitiseUserObject(req.body)
  
  if (user == null) {
    res.send(null)
    return
  }

  let collection = req.db.collection('user')

  try {
    await collection.insertOne(user)
  } catch (e) {
    console.log(e)
    res.send(null)
  }

  res.send(user)
}
