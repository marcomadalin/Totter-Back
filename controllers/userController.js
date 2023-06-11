const User = require("../models/userModel");

const getUser = async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id })
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

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
  getUser,
  createUser,
  deleteUser,
};
