const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.user;

router.get("/filter/:userId", async (req, res) => {
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

    User.find(
      query,
      "name username specialization grad_year",
      function (err, users) {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Error" });
        }

        res.json(users);
      }
    );
  } catch (err) {
    console.log(err);
    res.send({ err });
  }
});

module.exports = router;
