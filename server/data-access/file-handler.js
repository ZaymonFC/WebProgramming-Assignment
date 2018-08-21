import fs from 'fs'

export default function makeFileHandler(fileName) {
  return Object.freeze({
    checkFileStatus,
    readJSON,
    writeJSON
  })

  function checkFileStatus() {
    return new Promise((resolve, reject) => {
      fs.access(fileName, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
          reject(`${fileName} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`)
        } else {
          resolve(`${fileName} exists, and it is writable`)
        }
      })
    })
  }

  function readJSON() {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, (result, err) => {
        if (err) {
          reject(err)
        } else {
          resolve(JSON.stringify(result))
        }
      })
    })
  }

  function writeJSON(objects) {
    return new Promise((resolve, reject) => {
      let jsonString = JSON.stringify(objects)
      fs.writeFile(fileName, jsonString, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}

