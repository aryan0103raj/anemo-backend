const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.user;
const Blog = db.blog;

router.get("/", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    const blogs = await Blog.find({ collegeName: user.collegeName });

    res.json(blogs);
  } catch (err) {
    res.send({ message: "ERROR" });
  }
});

router.post("/new", (req, res) => {
  User.findOne({
    _id: req.body.userId,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "ERROR: User Not found." });
    }

    const blog = new Blog({
      username: user.username,
      collegeName: user.collegeName,
      title: req.body.title,
      content: req.body.content,
    });

    blog.save((err, blog) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.send({ message: "Blog posted successfully" });
    });
  });
});

router.get("/search/:username", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });

    const blogs = await Blog.find({
      collegeName: user.collegeName,
      username: { $regex: req.params.username },
    });

    res.json(blogs);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
