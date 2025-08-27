const { executeCode } = require("../utils/executeCode");
const { generateFile } = require("../utils/generateFile");
const { generateInputFile } = require("../utils/generateInputFile");
const path = require("path");
const fs = require('fs');

module.exports.RunCode = async (req, res) => {
    const {language = 'cpp', code, input = '', timeout = 3000} = req.body;
    let folder_path_glb
    if (code === undefined || code.trim() === ''){
        return res.status(404).json({ success: false, message: "Empty code! Please provide some code to execute.", output:'' });
    }
    try {
        // const filePath = generateFile(language, code);
        // 1. Generate a folder + source file
        const { filePath, folderPath, filename } = generateFile(language, code);
        folder_path_glb = folderPath;
        //const InputFilePath = generateInputFile(input);
        // 2. Create input file inside same folder
        const inputFilePath = path.join(folderPath, 'input.txt');
        fs.writeFileSync(inputFilePath, input);
        //const output = await executeCode(language, filePath, InputFilePath);
        // 3. Execute code
        const output = await executeCode(language, folderPath, filename, 'input.txt', timeout);

        // 4. Cleanup after execution
        // fs.rmSync(folderPath, { recursive: true, force: true });
        res.status(201).json({success:true, message: "Code ran successfully", output})
    } catch (error) {
        let errorMessage = "";
        if (error.stderr) {
            // Remove absolute file paths for cleaner output
            // **Change this part after dockerezing**
            errorMessage = error.stderr.replace(/([A-Z]:)?[\\/][^\s:]+/g, `code.${language}`);
        } else if (error.message) {
            errorMessage = error.message;
        } else if (error.error) {
            errorMessage = error.error;
        }else {
            errorMessage = String(error);
        }

        res.status(500).json({
            success: false,
            message: "Compilation error",
            error,
            errorMessage
        });
    }finally{
        try {
            fs.rmSync(folder_path_glb, { recursive: true, force: true });
            // console.log("clear folder processing called");
        } catch (cleanupErr) {
            console.error("Cleanup failed:", cleanupErr);
        }
    }
}