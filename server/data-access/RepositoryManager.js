import { resolve } from "path";

// Function to build a repository manager which takes an injected fileHandler

export default function makeRepositoryManager( fileHandler ) {

  return Object.freeze(
    findItems,
    insertItems,
    deleteItems,
    updateItems
  )

  function findItems(selector) {
    return new Promise((resolve, reject) => {
      fileHandler.readJSON()
        .then(results => {
          resolve(results.filter(item =>
            Object.entries(selector).every((key, value) => item[key] && item[key] === value)
          ))
        })
        .catch((err) => {
          reject('Failed to find items: ' + err)
        })
    })
  }

  function insertItems(object) {

  }

  function updateItems(selector) {

  }

  function deleteItems(selector) {
    return new Promise((resolve, reject) => {
      fileHandler.readJSON()
        .then(result => {
          for (let item of result) {
            for (const [key, value] in Object.entries(item)) {
              if (item.key && item.key === value) {
                item.deleted = true
              }
            }
          }
          const postDeletion = result.map((item) => !item.deleted)
          fileHandler.writeJSON(postDeletion)
            .then(() => resolve())
            .catch(err => reject('Error storing data post deletion' + err))
        })
        .catch(err => {
          reject('Failed to deleted items: ' + err)
        })
    })
  }
}
