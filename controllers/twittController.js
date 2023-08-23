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

const getFollowingUsersTwitts = async (req, res) => {
  try {
    const twitts = await Twitt.find({ user: { "$in" : req.query.following} }).sort({ createdAt: -1 });

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

const updateLikes = async (req, res) => {
  try {
    const userLikes = req.body.userLikes

    if (req.body.like) userLikes.push(req.userId)
    else {
      const index = userLikes.indexOf(req.userId);
      if (index > -1) userLikes.splice(index, 1);
    }

    const twitt= await Twitt.findOneAndUpdate(
        { _id: req.body.twittId },
        {
          $set: {
            likedBy: userLikes,
          },
          $inc: {
            likes: req.body.like ? 1 : -1,
          }
        },
        { returnOriginal: false }
    );

    res.status(200).json(twitt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const retwitt = async (req, res) => {
  try {
    const twitt = await Twitt.create(req.body);

    await Twitt.updateOne(
        { _id: twitt.fatherId },
        {
          $set: {
            retwittedBy: twitt.usernameRetwitt,
          },
          $inc: {
            retwitts: 1,
          }
        },
        { returnOriginal: false }
    );


    res.status(200).json(twitt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllTwitts,
  getAllUserTwitts,
  createTwitt,
  deleteTwitt,
  getFollowingUsersTwitts,
  updateLikes,
  retwitt,
};
