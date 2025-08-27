const express = require("express");
const cors = require("cors")
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authRoute")
const problemRoute = require("./routes/problemRoute")
const codeRunRoute = require("./routes/codeRunRoute")
const userRoute = require("./routes/userRoute")
const contestRoute = require("./routes/contestRoute")
const { DBConnection } = require("./config/db")

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

DBConnection();

const allowedOrigins = [
  "http://localhost:5173",   // local frontend
  "https://mycoddy.xyz",  // deployed frontend
];

app.use(cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
}));

// Use express.json() middleware to parse JSON request bodies
app.use(express.json()); // without this req.body is always undefined
app.use(express.urlencoded({ extended: true }));
// Use cookie-parser middleware
app.use(cookieParser());
// defining the auth route
app.use("/auth", authRoute);
app.use("/api/problem", problemRoute);
app.use("/api/user", userRoute);
app.use('/run', codeRunRoute);
app.use('/api/contest', contestRoute);

app.get("/", (req, res)=>{
    res.status(200).json({
        message: "Server is running!",
        status: "healthy",
        timestamp: new Date().toISOString()
    })
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})