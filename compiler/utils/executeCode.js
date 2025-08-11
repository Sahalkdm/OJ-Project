const { rejects } = require("assert");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const file_folder_path = path.join(__dirname, '..');
const output_path = path.join(file_folder_path, 'outputs');

if (!fs.existsSync(output_path)) {
    fs.mkdirSync(output_path, { recursive: true });
}

const executeCode = (filepath, inputFilePath) =>{
    const jobID = path.basename(filepath).split(".")[0];
    const out_path = path.join(output_path, `${jobID}.exe`);

    return new Promise((resolve, reject) => {
        exec(
            `g++ ${filepath} -o ${out_path} && cd ${output_path} && .\\${jobID}.exe < ${inputFilePath}`,
            
            (error, stdout, stderr) => {
                
                if (error) {
                    reject({error, stderr});
                }
                
                if (stderr){
                    reject(stderr);
                }
                
                resolve(stdout);
            }
            
        )
    })
}

module.exports = {
    executeCode,
}

/*
 * Helper responsible for compiling **and then executing** a C++ program that
 * was previously written to disk (see `generateFile.js`).
 *
 * How it works – high-level overview:
 * 1. Determine a dedicated output directory `outputs/` (created on the fly).
 * 2. Build a unique output filename that shares the UUID with the source file.
 * 3. Run the compilation command using the system's `g++` tool.
 * 4. If compilation succeeds, immediately execute the produced binary and
 *    capture its stdout/stderr so we can relay the result back to the client.
 *
 * The function is OS-aware: Windows expects a `.exe` artifact while Unix-like
 * systems (Linux/macOS) are happy with any executable bit, we simply use `.out`.
 * 
A Promise is used because:**

* The exec() function is asynchronous.

* You want to wait for the compilation and execution to finish before responding.

* If it succeeds → call resolve(stdout)

* If it fails → call reject(error or stderr)
 */