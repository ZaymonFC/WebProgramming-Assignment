import { ObjectId } from 'mongodb'
const uuid = require('uuid/v4');

const formidable = require('formidable')
let DIR = './server/data/images'

export async function uploadImage(req, res) {
  console.log('POST::image')

  try {
    let fileName = ''
    const form = new formidable.IncomingForm({ uploadDir: DIR })
    form.keepExtensions = true

    form.on('error', err => {
      throw err
    })

    form.on('fileBegin', (name, file) => {
      fileName = uuid() + file.name.slice(-4)
      file.path = form.uploadDir + '/' + fileName
    })

    form.on('file', function(field, file) {
      res.send({ image: fileName})
    })

    form.parse(req)
  } catch (err) {
    console.log('Error uploading image: ', err)
    return res.send({ status: 'Something went wrong' })
  }
}

async function createEntryForImage(req) {
  const imageCollection = req.db.collection('image')
  const info = await imageCollection.insertOne({})
  const imageName = info.insertedId
  return imageName
}

async function removeEntryForImage(req, imageName) {
  const imageCollection = req.db.collection('image')
  await imageCollection.deleteOne({ _id: ObjectId(imageName) })
}
