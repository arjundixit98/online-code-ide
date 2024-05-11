const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const Problem = require("./models/problem");

const dirCodes = path.join(__dirname, "codes");
const testCasesDir = path.join(__dirname, "testcases");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes);
}
if (!fs.existsSync(testCasesDir)) {
  fs.mkdirSync(testCasesDir);
}

const generateTestCaseFile = async (problemId, jobId) => {
  //create a test case while by querying problem model
  const problem = await Problem.findById(problemId);
  if (!problem) {
    console.log("Could not find problem");
  }
  const { testCaseInputString, testCaseExpectedOutputString } = problem;
  const inputFile = `${jobId}_input.txt`;
  const outputFile = `${jobId}_output.txt`;
  const inputFilePath = path.join(testCasesDir, inputFile);
  const outputFilePath = path.join(testCasesDir, outputFile);
  fs.writeFile(inputFilePath, testCaseInputString, (err) => {
    if (err) {
      console.log(err);
    }
  });

  fs.writeFile(outputFilePath, testCaseExpectedOutputString, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const generateFile = async (language, code, problemId) => {
  const jobId = uuid();
  if (problemId) await generateTestCaseFile(problemId, jobId);

  const fileName = `${jobId}.${language}`;
  const filePath = path.join(dirCodes, fileName);
  await fs.writeFile(filePath, code, (err) => {
    if (err) {
      console.log(err);
    }
  });
  return filePath;
};

module.exports = { generateFile };
