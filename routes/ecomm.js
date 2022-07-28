const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const db = require("../models");
const User = db.user;
const Ecommerce = db.ecommerce;

router.post("/addItem", async (req, res) => {
  const seller = await User.findOne({ _id: req.body.sellerId });
  req.body.sellerId = mongoose.Types.ObjectId(req.body.sellerId);

  var data = {
    sellerId: req.body.sellerId,
    college: seller.collegeName,
    username: seller.username,
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
    price: req.body.price,
  };

  const newItem = new Ecommerce(data);
  const savedItem = await newItem.save();

  const items = await Ecommerce.find({ sellerId: req.body.sellerId });
  res.json(items);
});

router.get("/:userId/:category/:title", async (req, res) => {
  try {
    const myuser = await User.findOne({ _id: req.params.userId });

    const query = {
      college: myuser.collegeName,
    };

    if (req.params.category !== "All") {
      query.category = {
        $regex: req.params.category,
      };
    }

    if (req.params.title !== "All") {
      query.title = {
        $regex: req.params.title,
        $options: "i",
      };
    }

    Ecommerce.find(query, function (err, items) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error" });
      }

      res.json(items);
    });
  } catch (err) {
    console.log(err);
    res.send({ err });
  }
});

module.exports = router;
