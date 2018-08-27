import fs from "fs";

export async function ReadJSON(filename) {
  try {
    const data = await fs.readFile(filename);
    return JSON.stringify(data);
  } catch (error) {
    console.error("Something went wrong reading JSON file: ", filename, error.message);
    return null;
  }
}

export async function WriteJSON(filename, data) {
  try {
    await fs.writeFile(JSON.stringify(data));
  } catch (error) {
    console.error("Error writing JSON to file: ", filename, error.message);
  }
}

