const express = require("express");
const {
  getUser,
  createUser,
  deleteUser,
  loginUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/login", loginUser);

router.post("/new", createUser);

router.get("/:id", getUser);

router.delete("/:id", deleteUser);

module.exports = router;
