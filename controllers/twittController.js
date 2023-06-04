const Twitt = require("../models/twittModel");

const getAllTwitts = async (req, res) => {
  try {
    const twitts = await Twitt.find().sort({ createdAt: -1 });
    res.status(200).json(twitts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//create new workout
const createRandomTwitt = async (req, res) => {
  try {
    const twitt = await Twitt.create(req.body.twitt);

    res.status(200).json(twitt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createTwitt = async (req, res) => {
  try {
    console.log(req)
    const twitt = await Twitt.create(req.body);

    res.status(200).json(twitt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllTwitts,
  createRandomTwitt,
  createTwitt,
};
