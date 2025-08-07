const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const DBConnection = async () =>{
    const MONGO_URI = process.env.MONGODB_URL;

    if (!MONGO_URI){
        console.error("Error: MONGODB_URL environment variable is not set");
        process.exit(1);
    }

    try{
        await mongoose.connect(MONGO_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error while connecting to the database:", error.message);
        process.exit(1); // Exit process if database connection fails
    }
}

// Export the connection function for use in other modules
module.exports = { DBConnection };