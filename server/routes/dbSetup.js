export async function resetAndSeedDb(req, res) {
  console.log('::DB RESETTING AND SEEDING')
  let db = req.db

  // Remove old collections
  let collectionNames = ['user', 'group', 'chat', 'channel', 'image']
  for (let collection of collectionNames) {
    try {
      await dropCollection(db, collection)
    } catch (error) {
      console.log(error, 'This is normal if the collection does not exist.')
    }
  }

  // Create new collections
  for (let collection of collectionNames) {
    await db.createCollection(collection)
    console.log('Created Collection: ', collection)
  }

  // Create Indexes
  db.collection('user').createIndex({ username: 1 }, { unique: true })
  db.collection('user').createIndex({ email: 1 }, { unique: true })
  db.collection('group').createIndex({ name: 1 }, { unique: true })
  db.collection('channel').createIndex({ name: 1, groupId: 1 }, { unique: true })
  db.collection('chat').createIndex({timeStamp: 1})
  console.info('Created collection constraints')

  // Seed Collection Data
  let userCollection = db.collection('user')

  await userCollection.insertOne({
    username: 'super',
    email: 'super@adminmail.com',
    rank: 'super-admin',
    password: '123'
  })
  console.log('Seeded super user')

  res.sendStatus(200)
}

async function dropCollection(db, collectionName) {
  await db.collection(collectionName).drop((err, result) => {
    console.log(`Dropped Collection: ${collectionName}`)
  })
}
