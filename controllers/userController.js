const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const validator = require("validator")

function createToken(_id) {
  return jwt.sign({_id: _id}, process.env.SECRET, {expiresIn: '1d'})
}

const verifyToken = async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET)
    res.status(200).json(true)
  }
  catch (error) {
    res.status(400).json({error: error.message})
  }
}

const loginUser = async (req, res) => {
  try {
    if (!(req.body.username && req.body.password)) return res.status(400).json({error: "All fields must be filled"})

    const user = await User.findOne({ username: req.body.username })
    if (!user) return res.status(400).json({error: "Incorrect username"})


    const match = await bcrypt.compare(req.body.password, user.password)
    if (!match) return res.status(400).json({error: "Incorrect password"})

    const token = createToken(user.id)

    res.status(200).json({user, token})
  }
  catch (error) {
    res.status(400).json({error: error.message})
  }
};

const checkUsername = async (req, res) => {
  try {
    const exists = await User.findOne({ username: req.query.username })
    if (exists) return res.status(400).json({error: "Username already in use"})

    res.status(200).json(true)
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    //if (!validator.isStrongPassword(req.body.password)) return res.status(400).json({error: "Password not strong enough"})

    const exists = await User.findOne({ username: req.body.username })

    if (exists) return res.status(400).json({error: "Username already in use"})

    const salt = await bcrypt.genSalt (10)
    const hash = await bcrypt.hash(req.body.password, salt)

    req.body.password = hash
    const user = await User.create(req.body);
    const token = createToken(user.id)

    res.status(200).json({user, token})

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    let user
    try {
      user = await User.findOne({_id: req.params.id})
      if (!user) return res.status(400).json({error: "User does not exist"})
    } catch (err) {
      user = await User.findOne({ username: req.params.id })
      if (!user) return res.status(400).json({error: "User does not exist"})
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getFollowRecommendations = async (req, res) => {
  try {
    const actualUser = await User.findOne({_id: req.userId})
    const users = (await User.find()).sort(() => Math.random() - 0.5);
    const recommendations = []

    if (users.length !== 0 ) {
      let index = 0
      while (recommendations.length !== 4 && index < users.length) {
        if (!actualUser._id.equals(users[index]._id) && !actualUser.following.includes(users[index]._id)) recommendations.push(users[index])
        ++index
      }
    }
    res.status(200).json(recommendations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const getUserFollowers = async (req, res) => {
  try {
    let user
    try {
      user = await User.findOne({_id: req.params.id})
      if (!user) return res.status(400).json({error: "User does not exist"})
    } catch (err) {
      user = await User.findOne({ username: req.params.id })
      if (!user) return res.status(400).json({error: "User does not exist"})
    }

    const followersPromises = user.followers.map(async (userId) => {
      try {
        const user = await User.findOne({ _id: userId });
        if (!user) throw new Error("Follower not found");
        return user;
      } catch (err) {
        return null;
      }
    });

    const followers = await Promise.all(followersPromises);

    const filteredFollowers = followers.filter((follower) => follower !== null);
    filteredFollowers.sort((a, b) => a.username.localeCompare(b.username));

    res.status(200).json(filteredFollowers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getUserFollowing = async (req, res) => {
  try {
    let user
    try {
      user = await User.findOne({_id: req.params.id})
      if (!user) return res.status(400).json({error: "User does not exist"})
    } catch (err) {
      user = await User.findOne({ username: req.params.id })
      if (!user) return res.status(400).json({error: "User does not exist"})
    }

    const followersPromises = user.following.map(async (userId) => {
      try {
        const user = await User.findOne({ _id: userId });
        if (!user) throw new Error("Follower not found");
        return user;
      } catch (err) {
        return null;
      }
    });

    const followers = await Promise.all(followersPromises);

    const filteredFollowers = followers.filter((follower) => follower !== null);
    filteredFollowers.sort((a, b) => a.username.localeCompare(b.username));

    res.status(200).json(filteredFollowers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {

    if (req.params.id !== req.userId) return res.status(403).json({error: "Cannot update user"})

    let bannerData = req.body.bannerData;
    let profileData = req.body.profileData;

    if (req.files && req.files.length > 0) {
      const bannerFile = req.files.find((file) => file.fieldname === 'banner');
      const profileFile = req.files.find((file) => file.fieldname === 'profile');

      if (bannerFile) {
        const bannerDataBuffer = bannerFile.buffer.toString("base64");
        bannerData = bannerDataBuffer;
      }

      if (profileFile) {
        const profileDataBuffer = profileFile.buffer.toString("base64");
        profileData = profileDataBuffer;
      }
    }

    if (req.body.deleteBanner) bannerData = ""

    const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            name: req.body.name,
            bio: req.body.bio,
            location: req.body.location,
            banner: bannerData,
            profile: profileData
          }
        },
        { returnOriginal: false }
    );

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const followUser = async (req, res) => {
  try {
    if (req.body.actualUser !== req.userId) return res.status(403).json({error: "Cannot follow user"})

    const actualUser = await User.findOne({ _id: req.body.actualUser })
    if (!actualUser) return res.status(400).json({error: "User does not exist"})

    const targetUser = await User.findOne({ _id: req.body.targetUser })
    if (!targetUser) return res.status(400).json({error: "User does not exist"})

    if (req.body.follow) {
      actualUser.following.push(req.body.targetUser)
      targetUser.followers.push(req.body.actualUser)
    }
    else {
      actualUser.following.remove(req.body.targetUser)
      targetUser.followers.remove(req.body.actualUser)
    }

    const userAct = await User.findOneAndUpdate(
        { _id: req.body.actualUser },
        {
          $set: {
            following: actualUser.following,
          }
        },
        { returnOriginal: false }
    );

    const userTarget = await User.findOneAndUpdate(
        { _id: req.body.targetUser },
        {
          $set: {
            followers: targetUser.followers,
          }
        },
        { returnOriginal: false }
    );

    res.status(200).json({userAct, userTarget});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.params.id !== req.userId) return res.status(403).json({error: "Cannot delete user"})

    const user = await User.deleteOne({ _id: req.params.id });

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  loginUser,
  checkUsername,
  createUser,
  getUser,
  getUserFollowers,
  getUserFollowing,
  getFollowRecommendations,
  deleteUser,
  verifyToken,
  updateUser,
  followUser
};
