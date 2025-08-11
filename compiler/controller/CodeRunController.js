const { executeCode } = require("../utils/executeCode");
const { generateFile } = require("../utils/generateFile");
const { generateInputFile } = require("../utils/generateInputFile");

module.exports.RunCode = async (req, res) => {
    const {language = 'cpp', code, input = ''} = req.body;

    if (code === undefined || code.trim() === ''){
        return res.status(404).json({ success: false, message: "Empty code! Please provide some code to execute.", output:'' });
    }
    try {
        const filePath = generateFile(language, code);
        const InputFilePath = generateInputFile(input);
        const output = await executeCode(filePath, InputFilePath);
        res.status(201).json({success:true, message: "Code ran successfully", output})
    } catch (error) {
        let errorMessage = "";

        if (error.stderr) {
            // Remove absolute file paths for cleaner output
            // **Change this part after dockerezing**
            errorMessage = error.stderr.replace(/([A-Z]:)?[\\/][^\s:]+/g, `code.${language}`);
        } else if (error.message) {
            errorMessage = error.message;
        } else {
            errorMessage = String(error);
        }

        res.status(500).json({
            success: false,
            message: "Compilation error",
            error,
            errorMessage
        });
    }
}