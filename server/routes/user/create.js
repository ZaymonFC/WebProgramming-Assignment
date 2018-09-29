import { sanitiseUserObject } from '../../sanitizers'

export async function createUser(req, res) {
  console.log('[POST::user]')
  const user = sanitiseUserObject(req.body)

  if (user == null) {
    return res.send({ status: 'Something went wrong' })
  }

  let collection = req.db.collection('user')
  
  try {
    await collection.insertOne(user)
    res.send(user)
  } catch (e) {
    if (e.code === 11000) {
      console.log('Not Unique')
      res.send({ status: 'not-unique' })
    } else {
      console.log(e)
      res.send({ status: 'Something went wrong' })
    }
  }

}
