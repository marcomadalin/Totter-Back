const express = require("express");
const {
  getAllTwitts,
  createRandomTwitt,
} = require("../controllers/twittController");

const router = express.Router();

//GET all twitts
router.get("/all", getAllTwitts);

router.post("/newRandom", createRandomTwitt);

module.exports = router;
