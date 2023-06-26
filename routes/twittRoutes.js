const express = require("express");
const {
  getAllTwitts,
  getAllUserTwitts,
  createRandomTwitt,
  createTwitt,
  deleteTwitt,
} = require("../controllers/twittController");

const requireAuth = require("../middleware/requreAuth");

const router = express.Router();

router.get("/all", getAllTwitts);

router.get("/allUser/:id", requireAuth, getAllUserTwitts);

router.post("/newRandom", createRandomTwitt);

router.post("/new", requireAuth, createTwitt);

router.delete("/delete/:id", requireAuth, deleteTwitt);

module.exports = router;
