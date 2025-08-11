const { RunCode } = require("../controller/CodeRunController");

const router = require("express").Router();

router.post("/code", RunCode);

module.exports = router;