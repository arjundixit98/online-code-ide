const mongoose = require("mongoose");

const counterSchema = mongoose.Schema({
  sequence_value: {
    type: Number,
    required: true,
  },
  counter_name: {
    type: String,
    required: true,
  },
});

const counterModel = new mongoose.model("counter", counterSchema);
module.exports = counterModel;
