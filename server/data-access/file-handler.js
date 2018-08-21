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
          reject(`${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`)
        } else {
          resolve(`${file} exists, and it is writable`)
        }
      })
    })
  }

  function readJSON() {

  }

  function writeJSON() {

  }
}

