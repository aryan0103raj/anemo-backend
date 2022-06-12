const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    collegeName: String,
  })
);

module.exports = User;
