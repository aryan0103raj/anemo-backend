const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  collegeName: String,
});

module.exports = mongoose.model("User", userSchema);
