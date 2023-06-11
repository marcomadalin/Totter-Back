const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
      email: {
          type: String,
          required: true,
      },
      password: {
          type: String,
          required: true,
      },
    birthdate: {
        type: String,
        required: true,
    },
    followers: {
      type: Array,
      required: true,
    },
    following: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
