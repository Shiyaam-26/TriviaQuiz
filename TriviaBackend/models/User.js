const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  scores: [Number],
});

module.exports = mongoose.model("User", UserSchema);
