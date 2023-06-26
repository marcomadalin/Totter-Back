const express = require("express");
const {
  getUser,
  createUser,
  deleteUser,
  loginUser,
  verifyToken
} = require("../controllers/userController");
const requireAuth = require("../middleware/requreAuth");

const router = express.Router();

router.post("/login", loginUser);

router.get("/verify", verifyToken);

router.post("/new", createUser);

router.get("/:id", getUser);

router.delete("/:id", requireAuth, deleteUser);

module.exports = router;
