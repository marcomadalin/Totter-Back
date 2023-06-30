const express = require("express");
const {
  getUser,
  createUser,
  deleteUser,
  loginUser,
  verifyToken,
  updateUser
} = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");
const multer = require('multer');

const upload = multer();

const router = express.Router();

router.post("/login", loginUser);

router.get("/verify", verifyToken);

router.post("/new", createUser);

router.get("/:id", getUser);

router.put("/:id", requireAuth, updateUser);

router.delete("/:id", requireAuth, upload.single('image'), deleteUser);

module.exports = router;
