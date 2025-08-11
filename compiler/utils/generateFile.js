const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const file_folder_path = path.join(__dirname, '..');
const code_dir = path.join(file_folder_path, 'codes');

if (!fs.existsSync(code_dir)){
    fs.mkdirSync(code_dir, {recursive: true});
}

const generateFile = (format, content) =>{
    const jobID = uuidv4();
    const filename = `${jobID}.${format}`;
    const file_path = path.join(code_dir, filename);

    fs.writeFileSync(file_path, content);
    return file_path;
}

module.exports = {
    generateFile,
}


/**
 * Utility responsible for creating unique temporary source-code files on disk.
 *
 * Why do we need this?
 * 1. The online compiler receives raw code text from the client.
 * 2. In order to compile / execute the program we must first write that text
 *    into a real file so that tools like `g++` can read it.
 * 3. We keep things tidy by placing every generated file inside a dedicated
 *    `codes` folder (created automatically if it does not yet exist).
 * 4. A UUID (universally-unique identifier) is used to ensure file names never
 *    clash when several users hit the endpoint at the same time.
 *
 * The main export is `generateFile(extension, code)` which returns **the full
 * path** of the freshly-created file so that the caller can pass it to the
 * next build / run step.
 */
