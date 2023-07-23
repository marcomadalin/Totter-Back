const express = require("express");
const {
  getUser,
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

const upload = multer();

const router = express.Router();

router.post("/login", loginUser);

router.get("/verify", verifyToken);

router.get("/checkUsername", checkUsername);

router.post("/new", createUser);

router.get("/recommendations", requireAuth, getFollowRecommendations);

router.get("/:id/followers", getUserFollowers);

router.get("/:id/following", getUserFollowing);

router.get("/:id", getUser);

router.put("/follow", requireAuth, followUser);

router.put("/:id", requireAuth, updateUser);

router.delete("/:id", requireAuth, upload.single('image'), deleteUser);

module.exports = router;
