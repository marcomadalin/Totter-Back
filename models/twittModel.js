const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const twittSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    fatherId: {
      type: String,
      required: false,
    },
    comments: {
      type: Array,
      required: true,
        default: [],
    },
    likes: {
      type: Number,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
      name: {
          type: String,
          required: true,
      },
    username: {
      type: String,
      required: true,
    },
      likedBy: {
          type: Array,
          required: true,
          default: [],
      },
      commentedBy: {
          type: Array,
          required: true,
          default: [],
      },
      retwittedBy: {
          type: Array,
          required: true,
          default: [],
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Twitt", twittSchema);
