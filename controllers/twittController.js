const Twitt = require("../models/twittModel");

const getAllTwitts = async (req, res) => {
  try {
    const twitts = await Twitt.find().sort({ createdAt: -1 });
    res.status(200).json(twitts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createRandomTwitt = async (req, res) => {
  try {
    const data = {
      text: "This is a twitt with a random numer: " + Math.floor(Math.random() * 1000000),
      mentionId: null,
      comments: [],
      retwitts: Math.floor(Math.random() * 1000000),
      likes: Math.floor(Math.random() * 1000000),
      user: "id" + Math.floor(Math.random() * 1000000),
      username: "randomuser" + Math.floor(Math.random() * 1000000),
    };
    const twitt = await Twitt.create(data);

    res.status(200).json(twitt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createTwitt = async (req, res) => {
  try {
    const twitt = await Twitt.create(req.body);

    res.status(200).json(twitt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteTwitt = async (req, res) => {
  try {
    const twitt = await Twitt.deleteOne({ _id: req.params.id });

    res.status(200).json(twitt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllTwitts,
  createRandomTwitt,
  createTwitt,
  deleteTwitt
};
