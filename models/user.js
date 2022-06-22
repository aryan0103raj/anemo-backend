const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  collegeName: String,
  bio: String,
  specialization: String,
  grad_year: Date,
  connect: [String],
  skills: [String],
});

module.exports = mongoose.model("User", userSchema);
