const express = require("express");
const router = express.Router();
const branchController = require("../controllers/branchController");
const verifyJWT = require('../middleware/verifyJWT');

router.get("/", verifyJWT, branchController.getBranches);
router.get("/:id", verifyJWT, branchController.getBranchById);
router.post("/", verifyJWT, branchController.createBranch);
router.put("/:id", verifyJWT, branchController.updateBranch);
router.delete("/:id", verifyJWT, branchController.deleteBranch);

module.exports = router;