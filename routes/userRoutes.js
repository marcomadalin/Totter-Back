const express = require("express");
const {
  getUser,
  createUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/:id", getUser);

router.post("/new", createUser);

router.delete("/:id", deleteUser);

module.exports = router;
