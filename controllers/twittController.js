const Twitt = require("../models/twittModel");
const Retwitt = require("../models/retwittModel");
const User = require("../models/userModel")
const {query} = require("express");

const mixTwittsAndRetwitts = async (twitts, retwitts) => {
  try {
    const updatedTwitts = await Promise.all(twitts.map(async (twitt) => {
      const user = await User.findById(twitt.user);
      const twittObject = twitt.toObject();
      if (Object.hasOwn(twittObject, "fatherId") && twitt.fatherId !== null) {
        const father = await Twitt.findById(twitt.fatherId)
        twittObject.commentUsername = father.username
      }
      twittObject.image = user.profile;
      twittObject.compare = twittObject.createdAt
      return twittObject;
    }));

    const updatedRewitts = await Promise.all(retwitts.map(async (retwitt) => {
      const user = await User.findById(retwitt.userId);
      let retwittObject = retwitt.toObject()
      let twitt = updatedTwitts.find((twitt) => twitt._id.equals(retwitt.twittId))
      if (twitt === null || twitt === undefined) {
        twitt = await Twitt.findById(retwitt.twittId)
        const user = await User.findById(twitt.user);
        const twittObject = twitt.toObject();
        twittObject.image = user.profile;
        twittObject.compare = twittObject.createdAt
        twitt = twittObject

        if (Object.hasOwn(twittObject, "fatherId") && twitt.fatherId !== null) {
          const father = await Twitt.findById(twitt.fatherId)
          twitt.commentUsername = father.username
        }
      }

      retwittObject.retwittUsername = user.username
      orgCompare = structuredClone(retwittObject.createdAt)
      retwittObject = Object.assign(retwittObject, twitt)
      retwittObject.compare = orgCompare

      return retwittObject;
    }));

    const result = [...updatedTwitts, ...updatedRewitts]
    result.sort((a,b) => { return b.compare - a.compare })

    return result
  }
  catch (e) {
    console.log(e)
  }
}

const getAllTwitts = async (req, res) => {
  try {
    const twitts = await Twitt.find()
    const retwitts = await Retwitt.find()

    const result = await mixTwittsAndRetwitts(twitts, retwitts)
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getPost = async (req, res) => {
  try {
    let twitt = {}
    if (req.query.findTwitt) twitt = await Twitt.findById(req.params.id)
    if (twitt === null) return res.status(400).json({error: "Twitt does not exist"})

    if (Object.hasOwn(twitt, "fatherId") && twitt.fatherId !== null) {
      const father = await Twitt.findById(twitt.fatherId)
      twitt.commentUsername = father.username
    }

    let responses = await Twitt.find({fatherId: req.params.id}).sort({ createdAt: -1 });
    if (responses === null) responses = []

    const updatedResponses = await Promise.all(responses.map(async (twitt) => {
      const user = await User.findById(twitt.user);
      const twittObject = twitt.toObject();
      if (Object.hasOwn(twittObject, "fatherId") && twitt.fatherId !== null) {
        const father = await Twitt.findById(twitt.fatherId)
        twittObject.commentUsername = father.username
      }
      twittObject.image = user.profile;
      return twittObject;
    }));

    const result = {
      twitt: twitt,
      responses: updatedResponses
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllUserTwitts = async (req, res) => {
  try {
    const twitts = await Twitt.find({ user: req.params.id })
    const retwitts = await Retwitt.find({ userId: req.params.id })

    const result = await mixTwittsAndRetwitts(twitts, retwitts)
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getFollowingUsersTwitts = async (req, res) => {
  try {
    const twitts = await Twitt.find({ user: { "$in" : req.query.following} })
    const retwitts = await Twitt.find({ userId: { "$in" : req.query.following} })

    const result = await mixTwittsAndRetwitts(twitts, retwitts)
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createTwitt = async (req, res) => {
  try {
    let imageData = null
    const imageFile = req.files.find((file) => file.fieldname === 'img');

    if (req.body.hasImage.toLowerCase() === 'true') imageData = imageFile.buffer.toString("base64");

    const data = {
      text: req.body.text,
      user: req.body.user,
      name: req.body.name,
      fatherId: req.body.fatherId.toLowerCase() !== "null" ? req.body.fatherId : null,
      username: req.body.username,
      img: imageData,
    }

    const twitt = await Twitt.create(data);

    let result = {
      twitt : twitt,
      father: null
    }

    if (twitt.fatherId !== null && req.body.fatherId.toLowerCase() !== "null") {
      const newComments = JSON.parse(req.body.comments)
      newComments.push(req.userId)

      const father= await Twitt.findOneAndUpdate(
          { _id: twitt.fatherId },
          {
            $set: {
              commentedBy: newComments,
            },
          },
          { returnOriginal: false }
      );
      result.father = father
    }

    res.status(200).json(result);
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

const createRetwitt = async (req, res) => {
  try {
    await Retwitt.create(req.body.data);

    const newRetwitts = req.body.retwitts
    newRetwitts.push(req.body.data.userId)

    const twitt = await Twitt.findOneAndUpdate(
        { _id: req.body.data.twittId },
        {
          $set: {
            retwittedBy: newRetwitts,
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

const deleteRetwitt = async (req, res) => {
  try {

    await Retwitt.findOneAndDelete({userId: req.query.userId, twittId: req.query.twittId})

    const newRetwitts = req.query.retwitts
    const index = newRetwitts.indexOf(req.query.userId);
    if (index > -1) newRetwitts.splice(index, 1);


    const twitt = await Twitt.findOneAndUpdate(
        { _id: req.query.twittId },
        {
          $set: {
            retwittedBy: newRetwitts,
          },
        },
        { returnOriginal: false }
    );


    res.status(200).json(twitt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteTwitt = async (req, res) => {
  try {
    await Retwitt.deleteMany({twittId: req.params.id})
    const twitt = await Twitt.findOneAndDelete(req.params.id)

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
  getPost,
  updateLikes,
  createRetwitt,
  deleteRetwitt
};
