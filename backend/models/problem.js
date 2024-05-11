const mongoose = require("mongoose");

const problemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  problemNumber: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  //comma separated inputs
  testCasesCount: {
    type: Number,
    required: true,
  },
  testCaseInputString: {
    type: String,
    required: true,
  },
  testCaseExpectedOutputString: {
    type: String,
    required: true,
  },
});

const problemModel = new mongoose.model("problems", problemSchema);
module.exports = problemModel;
