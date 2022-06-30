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
  "/get/:userId",
  asyncHandler(async (req, res, next) => {
    const messages = await Message.find(
      {
        $or: [{ user1: req.params.userId }, { user2: req.params.userId }],
      },
      "user1 user2"
    )
      .populate("user1", "name username")
      .populate("user2", "name username");

    res.json(messages);
  })
);

router.get(
  "/:user1Id/:user2Id",
  asyncHandler(async (req, res, next) => {
    const messages = await Message.findOne({
      $or: [
        {
          $and: [{ user1: req.params.user1Id }, { user2: req.params.user2Id }],
        },
        {
          $and: [{ user1: req.params.user2Id }, { user2: req.params.user1Id }],
        },
      ],
    })
      .populate("user1", "name username")
      .populate("user2", "name username");

    messages && messages.chats;
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

router.get("/:userId", async (req, res) => {
  try {
    const myuser = await User.findOne({ _id: req.params.userId });

    const query = {
      collegeName: myuser.collegeName,
    };

    if (
      new Date(req.query.grad_year).getFullYear() != new Date(0).getFullYear()
    ) {
      query.$expr = {
        $eq: [{ $year: "$grad_year" }, req.query.grad_year],
      };
    }

    if (req.query.specialization) {
      query.specialization = {
        $regex: req.query.specialization,
        $options: "i",
      };
    }

    if (req.query.username) {
      query.$or = [
        { username: { $regex: req.query.username, $options: "i" } },
        { name: { $regex: req.query.username, $options: "i" } },
      ];
    }

    User.find(query, "name username", async function (err, users) {
      let result = [];

      for (const user of users) {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Error" });
        }

        const messages = await Message.find(
          {
            $or: [
              {
                $and: [{ user1: req.params.userId }, { user2: user._id }],
              },
              {
                $and: [{ user1: user._id }, { user2: req.params.userId }],
              },
            ],
          },
          "user1 user2"
        )
          .populate("user1", "name username")
          .populate("user2", "name username");

        messages.length === 0 &&
          user._id.toString() !== req.params.userId &&
          result.push(user);
      }

      res.json(result);
    });
  } catch (err) {
    console.log(err);
    res.send({ err });
  }
});

module.exports = router;
