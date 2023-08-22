const express = require("express");
const {
  getAllTwitts,
  getAllUserTwitts,
  getFollowingUsersTwitts,
  createTwitt,
  deleteTwitt,
  updateLikes,

} = require("../controllers/twittController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.get("/allFollowing", requireAuth, getFollowingUsersTwitts);

router.get("/all", getAllTwitts);

router.get("/allUser/:id", getAllUserTwitts);

router.put("/updateLikes", requireAuth, updateLikes);

router.post("/new", requireAuth, createTwitt);

router.delete("/delete/:id", requireAuth, deleteTwitt);

module.exports = router;
