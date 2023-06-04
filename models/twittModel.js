const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const twittSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    mentionId: {
      type: String,
      required: false,
    },
    comments: {
      type: Array,
      required: true,
    },
    retwitts: {
      type: Number,
      required: true,
    },
    likes: {
      type: Number,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Twitt", twittSchema);
