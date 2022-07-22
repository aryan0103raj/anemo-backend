const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ecommerceSchema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: "User" },
  username: String,
  category: {
    type: String,
    enum: ["Product", "Services"],
    required: true,
  },
  college: String,
  title: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Ecommerce", ecommerceSchema);
