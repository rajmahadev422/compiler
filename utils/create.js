import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";


export async function createFolder(folderPath, code, input) {

  if(!folderPath || !code || !input) {
    throw new Error('Please give details of id , code and input');
  }
  try {
    // Create folder
    await fs.mkdir(folderPath, { recursive: true });

    // Create file
    const codePath = path.join(folderPath, 'main.cpp');
    const inputPath = path.join(folderPath, 'input.txt');

    await fs.writeFile(codePath, code);
    await fs.writeFile(inputPath, input);
    return {isCreated: null};
    
  } catch (err) {
    return {isCreated: err.message}
  }
};

/**
 * Delete folder and all files inside it
 */
export async function deleteFolder(folderPath) {
  try {
    // const folderPath = path.join(ROOT_DIR, folderName);

    await fs.rm(folderPath, {
      recursive: true,
      force: true,
    });

    console.log(`Deleted: ${folderPath}`);
  } catch (error) {
    console.error("Delete Error:", error);
  }
}