const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  room_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Message", messageSchema);
