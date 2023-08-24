const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const retwittSchema = new Schema(
  {
    twittId: {
      type: String,
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Retwitt", retwittSchema);
