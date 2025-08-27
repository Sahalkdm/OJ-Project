const path = require("path");
const fs = require('fs');
const { exec } = require("child_process");

const executeCode = (language, folderPath, filename, inputFilePath, timeout) => {
    return new Promise((resolve, reject) => {
        const jobID = path.basename(folderPath); // UUID folder name
        let command;

        switch (language) {
            case "cpp": {
                const outPath = path.join(folderPath, `${jobID}.exe`);
                command = `g++ ${filename} -o ${outPath} && cd ${folderPath} && .\\${jobID}.exe < ${inputFilePath}`;
                //command = `g++ ${filename} -o ${outPath} && cd ${folderPath} && ./${jobID}.exe < ${inputFilePath}`;
                break;
            }
            case "java": {
                // Always use Main.java for simplicity
                command = `javac ${filename} && cd ${folderPath} && java Main < ${inputFilePath}`;
                break;
            }
            case "py": {
                command = `cd ${folderPath} && python3 ${filename} < ${inputFilePath}`;
                break;
            }
            case "js": {
                command = `cd ${folderPath} && node ${filename} < ${inputFilePath}`;
                break;
            }
            default:
                return reject(new Error("Unsupported language"));
        }

        // const start = process.hrtime(); // Get the high-resolution time at the start
        // const startTime = performance.now(); // Record the starting time.

        exec(
            command, 
            { cwd: folderPath, timeout: timeout }, 
            (error, stdout, stderr) => {
                // const endTime = performance.now(); // Record the ending time.
            if (error) {
                if (error.killed) {
                    return reject({ error: "Time Limit Exceeded" });
                }
                return reject({ error, stderr })
            };
            // const end = process.hrtime(start); // Get the high-resolution time at the end, relative to 'start'
            if (stderr) return reject(stderr);
            resolve(stdout);
            // Convert the result to milliseconds for readability
            // const milliseconds = (end[0] * 1000) + (end[1] / 1000000);
            // console.log(`Execution time: ${milliseconds} ms`);
            // console.log(`Execution time Perfomnace: ${endTime - startTime} milliseconds`);
        });
    });
};

module.exports = { executeCode };


// `g++ ${filepath} -o ${out_path} && cd ${output_path} && .\\${jobID}.exe < ${inputFilePath}`

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