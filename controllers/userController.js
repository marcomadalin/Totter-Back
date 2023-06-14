const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const validator = require("validator")

function createToken(_id) {
  return jwt.sign({_id: _id}, process.env.SECRET, {expiresIn: '1d'})
}

const loginUser = async (req, res) => {
  try {
    if (!(req.body.username && req.body.password)) return res.status(400).json({error: "All fields must be filled"})

    const user = await User.findOne({ username: req.body.username })
    if (!user) return res.status(400).json({error: "Incorrect username"})


    const match = await bcrypt.compare(req.body.password, user.password)
    if (!match) return res.status(400).json({error: "Incorrect password"})

    const token = createToken(user.id)

    res.status (200).json({user, token})
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
};
