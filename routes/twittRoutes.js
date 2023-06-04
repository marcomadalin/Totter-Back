const express = require("express");
const {
  getAllTwitts,
  createRandomTwitt,
  createTwitt,
} = require("../controllers/twittController");

const router = express.Router();

//GET all twitts
router.get("/all", getAllTwitts);

//POST random twitt
router.post("/newRandom", createRandomTwitt);

//POST user twitt
router.post("/new", createTwitt);

module.exports = router;
