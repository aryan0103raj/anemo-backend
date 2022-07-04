const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
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

router.post("/upload/:userId", upload.single("file"), async (req, res) => {
  try {
    console.log(req.file);

    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: { profilePicture: req.file.filename } },
      { new: true }
    );

    if (req.file == undefined) {
      return res.send({
        message: "You must select a file.",
      });
    }

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.send({
      message: "Error when trying upload image: ${error}",
    });
  }
});

module.exports = router;
