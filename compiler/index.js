const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const runRoute = require('./routes/CodeRunRoute')
const app = express();
dotenv.config();

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/run', runRoute)

app.get('/', (req, res) => {
    res.json({online:"Compiler"})
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}!`);
});