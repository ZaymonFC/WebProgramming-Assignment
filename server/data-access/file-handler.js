import fs from "fs";

export async function ReadJSON(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        console.error("Something went wrong reading JSON file: ", filename);
        reject(err)
      }
      resolve(JSON.parse(data))
    })
  })
}

export async function WriteJSON(filename, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(data), (err) => {
      if (err) {
        console.error("Something went wrong writing to JSON file: ", filename)
        reject(err)
      }
      resolve()
    })
  })
}

