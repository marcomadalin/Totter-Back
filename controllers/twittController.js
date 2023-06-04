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
    const twittData = {
      text: "Hello, Twitter!",
      mentionId: "user" + Math.random(),
      comments: [Math.random(), Math.random()],
      retwitts: Math.random(),
      likes: Math.random(),
      user: "JohnDoe",
      username: "johndoe" + Math.random(),
    };

    const twitt = await Twitt.create(twittData);

    res.status(200).json(twitt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllTwitts,
  createRandomTwitt,
};
