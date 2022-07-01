const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatListSchema = new Schema({
  user1: { type: Schema.Types.ObjectId, ref: "User" },
  chatList: [
    {
      user2: { type: Schema.Types.ObjectId, ref: "User" },
      lastUpdate: String,
      lastMessage: String,
    },
  ],
});

module.exports = mongoose.model("ChatList", chatListSchema);
