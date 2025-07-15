const express = require("express");
const router = express.Router();
const { refreshToken } = require("../controllers/auth.controller");

router.post("/refresh-token", refreshToken);

module.exports = router;
