const mongoose = require("mongoose");

const Blog = mongoose.model(
  "Blog",
  new mongoose.Schema({
    username: String,
    collegeName: String,
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: Number,
    },
  })
);

module.exports = Blog;
