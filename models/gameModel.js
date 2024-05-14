const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    unique: true,
  },
  message: {
    type: String,
    required: false, // Make message optional since not every socket emission is a chat message.
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set the date when the document is created.
  },
  diceThrow: {
    type: Number,
    required: false,
  },
  totalScore: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("Game", GameSchema);
