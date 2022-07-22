const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user");
db.blog = require("./blog");
db.college = require("./college");
db.message = require("./message");
db.chatList = require("./chatList");
db.ecommerce = require("./ecomm");

module.exports = db;
