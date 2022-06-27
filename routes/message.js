const express = require("express");
const { mongoose } = require("../models");
const router = express.Router();
const db = require("../models");
const User = db.user;
const Message = db.message;

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

router.get(
  "/:userId",
  asyncHandler(async (req, res, next) => {
    const messages = await Message.find({
      $or: [{ user1: req.params.userId }, { user2: req.params.userId }],
    })
      .populate("user1", "name username")
      .populate("user2", "name username");

    res.json(messages);
  })
);

router.post(
  "/send",
  asyncHandler(async (req, res, next) => {
    req.body.user1 = mongoose.Types.ObjectId(req.body.user1);
    req.body.user2 = mongoose.Types.ObjectId(req.body.user2);

    const roomExists = await Message.findOne({
      $or: [
        { $and: [{ user1: req.body.user1 }, { user2: req.body.user2 }] },
        { $and: [{ user1: req.body.user2 }, { user2: req.body.user1 }] },
      ],
    });

    if (roomExists) {
      const pushedMessage = await Message.findOneAndUpdate(
        {
          $or: [
            { $and: [{ user1: req.body.user1 }, { user2: req.body.user2 }] },
            { $and: [{ user1: req.body.user2 }, { user2: req.body.user1 }] },
          ],
        },
        {
          $addToSet: {
            chats: { sender: req.body.sender, message: req.body.message },
          },
        },
        { new: true }
      );

      res.json(pushedMessage);
    } else {
      var data = {
        user1: req.body.user1,
        user2: req.body.user2,
        chats: [{ sender: req.body.sender, message: req.body.message }],
      };
      const newRoom = new Message(data);
      const savedRoom = await newRoom.save();

      res.json(savedRoom);
    }
  })
);

module.exports = router;
