const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.user;
const Blog = db.blog;

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    const likedBlogs = await Blog.find({
      likes: { $elemMatch: { userId: req.params.userId } },
    });

    const temp = [];
    for (const blog of likedBlogs) {
      blog.isLiked = true;
      temp.push(blog._id);
    }

    const unlikedBlogs = await Blog.find({
      _id: { $nin: temp },
    });

    const blogs = likedBlogs.concat(unlikedBlogs);
    blogs.sort(function (a, b) {
      var dateA = new Date(a.createdAt),
        dateB = new Date(b.createdAt);
      return dateB - dateA;
    });

    res.json(blogs);
  } catch (err) {
    console.log(err);
    res.send({ err });
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
      createdAt: Date.now(),
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

router.get("/search/:username/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });

    const likedBlogs = await Blog.find({
      collegeName: user.collegeName,
      username: { $regex: req.params.username },
      likes: { $elemMatch: { userId: req.params.userId } },
    });

    const temp = [];
    for (const blog of likedBlogs) {
      blog.isLiked = true;
      temp.push(blog._id);
    }

    const unlikedBlogs = await Blog.find({
      _id: { $nin: temp },
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

router.post("/add_comment", (req, res) => {
  User.findOne({ _id: req.body.userId }).exec((err, user) => {
    Blog.findOneAndUpdate(
      { _id: req.body.blogId },
      {
        $push: {
          comments: {
            userId: req.body.userId,
            username: user.username,
            comment: req.body.comment,
          },
        },
      },
      { new: true }
    ).then(function (blog) {
      res.status(200).json(blog);
    });
  });
});

router.post("/delete_comment", (req, res) => {
  User.findOne({ _id: req.body.userId }).exec((err, user) => {
    Blog.findOneAndUpdate(
      { _id: req.body.blogId },
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true },
      (err, blog) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Error" });
        }

        res.json(blog);
      }
    );
  });
});

router.post("/do_like", (req, res) => {
  User.findOne({ _id: req.body.userId }).exec((err, user) => {
    Blog.findOneAndUpdate(
      { _id: req.body.blogId },
      {
        $push: {
          likes: {
            userId: req.body.userId,
            username: user.username,
          },
        },
        $inc: {
          likesCount: 1,
        },
        $set: {
          isLiked: true,
        },
      },
      { new: true },
      (err, blog) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Error" });
        }

        res.json(blog);
      }
    );
  });
});

router.post("/undo_like", (req, res) => {
  User.findOne({ _id: req.body.userId }).exec((err, user) => {
    Blog.findOneAndUpdate(
      { _id: req.body.blogId },
      {
        $pull: {
          likes: {
            userId: req.body.userId,
          },
        },
        $inc: {
          likesCount: 1,
        },
        $set: {
          isLiked: false,
        },
      },
      { new: true },
      (err, blog) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Error" });
        }

        res.json(blog);
      }
    );
  });
});

module.exports = router;
