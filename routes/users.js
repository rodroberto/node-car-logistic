const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyJWT = require('../middleware/verifyJWT');

router.get("/", verifyJWT, userController.getUsers);
router.get("/:id", verifyJWT, userController.getUserById);
router.post("/:id", verifyJWT, userController.updateUser);
router.delete("/:id", verifyJWT, userController.deleteUser);

module.exports = router;