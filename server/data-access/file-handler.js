import fs from 'fs'

export default function makeFileHandler(fileName) {
  return Object.freeze({
    checkFileStatus,
    readJSON,
    writeJSON
  })

  function checkFileStatus() {
    fs.access(fileName, fs.constants.F_OK | fs.constants.W_OK, (err) => {
      if (err) {
        console.error(`${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`)
        return false
      } else {
        console.log(`${file} exists, and it is writable`)
        return true
      }
    })
  }

  function readJSON() {

  }

  function writeJSON() {

  }
}

