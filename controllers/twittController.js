const Twitt = require("../models/twittModel");
const User = require("../models/userModel")

const getAllTwitts = async (req, res) => {
  try {
    const twitts = await Twitt.find().sort({ createdAt: -1 });

    const updatedTwitts = await Promise.all(twitts.map(async (twitt) => {
      const user = await User.findById(twitt.user);
      const twittObject = twitt.toObject();
      twittObject.image = user.profile;
      return twittObject;
    }));

    res.status(200).json(updatedTwitts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllUserTwitts = async (req, res) => {
  try {
    const twitts = await Twitt.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json(twitts);
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
  getAllUserTwitts,
  createTwitt,
  deleteTwitt
};
