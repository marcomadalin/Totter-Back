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
      usernameRetwitt: {
          type: String,
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
      isRetwitt: {
          type: Boolean,
          required: true,
          default: false,
      }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Twitt", twittSchema);
