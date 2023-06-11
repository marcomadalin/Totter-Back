const express = require("express");
const {
  getAllTwitts,
  getAllUserTwitts,
  createRandomTwitt,
  createTwitt,
  deleteTwitt,
} = require("../controllers/twittController");

const router = express.Router();

router.get("/all", getAllTwitts);

router.get("/user/:id", getAllUserTwitts);

router.post("/newRandom", createRandomTwitt);

router.post("/new", createTwitt);

router.delete("/delete/:id", deleteTwitt);

module.exports = router;
