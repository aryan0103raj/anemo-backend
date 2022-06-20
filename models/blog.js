const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  userId: String,
  username: String,
  comment: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now() },
});

const likeSchema = new Schema({
  userId: String,
  username: String,
  createdAt: { type: Date, default: Date.now() },
});

const blogSchema = new Schema({
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
    default: Date.now(),
  },
  comments: [commentSchema],
  likes: [likeSchema],
  likesCount: {
    type: Number,
    default: 0,
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
