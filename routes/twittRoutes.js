const express = require("express");
const {
  getAllTwitts,
  createRandomTwitt,
  createTwitt,
  deleteTwitt,
} = require("../controllers/twittController");

const router = express.Router();

router.get("/all", getAllTwitts);

router.post("/newRandom", createRandomTwitt);

router.post("/new", createTwitt);

router.delete("/delete/:id", deleteTwitt);

module.exports = router;
