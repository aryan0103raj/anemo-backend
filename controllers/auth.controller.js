const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const College = db.college;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    collegeName: req.body.collegeName,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user
    .save()
    .then((result) => {
      var query = { name: req.body.collegeName },
        update = { $push: { users: user } },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

      College.findOneAndUpdate(query, update, options, function (err, result) {
        if (err) {
          return res.send({ message: "Error Here" });
        }

        var token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400,
        });

        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          university: user.collegeName,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "ERROR: User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password! Please try again.",
      });
    }

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400,
    });

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      university: user.collegeName,
      accessToken: token,
    });
  });
};
