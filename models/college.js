const mongoose = require("mongoose");

const CollegeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
