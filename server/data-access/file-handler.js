import fs from "fs";

export default function makeFileHandler(fileName) {
  return Object.freeze({
    // checkFileStatus,
    ReadJSON,
    WriteJSON
  });
  
  async function ReadJSON() {
    try {
      const data = await fs.readFile(filename);
      return JSON.stringify(data);
    } catch (error) {
      console.error('Something went wrong reading JSON', error);
      return null;
    }
  }

  async function WriteJSON(data) {
    try {
      await fs.writeFile(JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  }

}
