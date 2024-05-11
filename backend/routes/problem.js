const express = require("express");
const router = express.Router();
const Problem = require("../models/problem");
const Counter = require("../models/counter");

router.get("/get-problems", async (req, res) => {
  const allProblems = await Problem.find({});
  console.log(allProblems);
  return res.json(allProblems);
});

router.get("/get-problem", async (req, res) => {
  const problemId = req.query.id;
  const problem = await Problem.findById(problemId);
  console.log(problem);
  return res.json(problem);
});

const getNextSequenceValue = async () => {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { counter_name: "problem" },
    { $inc: { sequence_value: 1 } }
  );

  //console.log(sequenceDocument);
  return sequenceDocument.sequence_value;
};

router.post("/add-problem", async (req, res) => {
  const {
    problemName,
    problemDescription,
    testCasesCount,
    testCaseInput,
    testCaseExpectedOutput,
  } = req.body;

  if (!problemName || !problemDescription) {
    return res.status(400).json({
      status: "error",
      message: "Either name or description is empty!",
    });
  }

  const problem = await Problem.create({
    name: problemName,
    description: problemDescription,
    testCasesCount,
    testCaseInputString: testCaseInput,
    testCaseExpectedOutputString: testCaseExpectedOutput,
    problemNumber: await getNextSequenceValue(),
  });

  const problemId = problem._id;

  return res.status(201).json({
    status: "success",
    message: `Problem added with id : ${problemId}`,
  });
});

module.exports = router;
