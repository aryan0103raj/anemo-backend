const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user");
db.blog = require("./blog");
db.college = require("./college");
db.message = require("./message");
db.room = require("./room");

module.exports = db;
