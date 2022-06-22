const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.user;
const Blog = db.blog;

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.send({ err });
  }
});

router.post("/edit", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body.userId },
    {
      $set: {
        grad_year: req.body.grad_year,
        bio: req.body.bio,
        connect: req.body.connect,
        specialization: req.body.specialization,
        skills: req.body.skills,
      },
    },
    { new: true },
    (err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error" });
      }

      res.json(user);
    }
  );
});

router.get("/myblogs/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });

    const likedBlogs = await Blog.find({
      username: user.username,
      likes: { $elemMatch: { userId: req.params.userId } },
    });

    const temp = [];
    for (const blog of likedBlogs) {
      blog.isLiked = true;
      temp.push(blog._id);
    }

    const unlikedBlogs = await Blog.find({
      _id: { $nin: temp },
      username: user.username,
    });

    const blogs = likedBlogs.concat(unlikedBlogs);
    blogs.sort(function (a, b) {
      var dateA = new Date(a.createdAt),
        dateB = new Date(b.createdAt);
      return dateB - dateA;
    });

    res.json(blogs);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
