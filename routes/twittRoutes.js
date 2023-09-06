const express = require("express");
const {
  getAllTwitts,
  getAllUserTwitts,
  getFollowingUsersTwitts,
  getPost,
  createTwitt,
  deleteTwitt,
  updateLikes,
  createRetwitt,
  deleteRetwitt

} = require("../controllers/twittController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.get("/allFollowing", requireAuth, getFollowingUsersTwitts);

router.get("/all", getAllTwitts);

router.get("/allUser/:id", getAllUserTwitts);

router.get("/:id", getPost);

router.put("/updateLikes", requireAuth, updateLikes);

router.post("/newRetwitt", requireAuth, createRetwitt);

router.post("/new", requireAuth, createTwitt);

router.delete("/deleteRetwitt", requireAuth, deleteRetwitt);

router.delete("/:id", requireAuth, deleteTwitt);


module.exports = router;
