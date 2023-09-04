const express = require("express");
const {
  getUser,
    findUser,
  checkUsername,
  getUserFollowers,
  getUserFollowing,
  getFollowRecommendations,
  createUser,
  deleteUser,
  loginUser,
  verifyToken,
  updateUser,
  followUser
} = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");
const multer = require('multer');

const router = express.Router();

router.post("/login", loginUser);

router.post("/new", createUser);

router.get("/verify", verifyToken);

router.get("/checkUsername", checkUsername);

router.get("/recommendations", requireAuth, getFollowRecommendations);

router.get("/search", findUser);

router.get("/:id/followers", getUserFollowers);

router.get("/:id/following", getUserFollowing);

router.get("/:id", getUser);

router.put("/follow", requireAuth, followUser);

router.put("/:id", requireAuth, updateUser);

router.delete("/:id", requireAuth, deleteUser);

module.exports = router;
