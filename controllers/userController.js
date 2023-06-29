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
    console.log(decoded)
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

const createUser = async (req, res) => {
  try {
    if (!validator.isStrongPassword(req.body.password)) return res.status(400).json({error: "Password not strong enough"})

    const exists = await User.findOne({ username: req.body.username })

    if (exists) return res.status(400).json({error: "Username already in use"})

    const salt = await bcrypt.genSalt (10)
    const hash = await bcrypt.hash(req.body.password, salt)

    req.body.password = hash
    const user = await User.create(req.body);
    const token = createToken(user.id)

    res.status(200).json({user, token})

  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id })
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    console.log("body:")
    console.log(req.body)
    const user = await User.findOneAndUpdate({ _id: req.params.id },
        {
          $set:{
            name: req.body.name,
            bio: req.body.bio,
            location: req.body.location,
            banner: req.body.bannerData,
            profile: req.body.profileData
          }
        }, { returnOriginal: false })

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.deleteOne({ _id: req.params.id });

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  loginUser,
  createUser,
  getUser,
  deleteUser,
  verifyToken,
  updateUser,
};
