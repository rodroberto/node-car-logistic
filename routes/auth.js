const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.handleLogin)
router.post("/register", authController.handleRegister)
router.post("/forgot-password", authController.forgotPassword)
router.post("/reset-password", authController.resetPassword)

module.exports = router;