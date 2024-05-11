const path = require("path");
const fs = require("fs");
const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);

const outputsDir = path.join(__dirname, "outputs");
const testCasesDir = path.join(__dirname, "testcases");
if (!fs.existsSync(outputsDir)) {
  fs.mkdirSync(outputsDir);
}

const executeCode = async (language, filePath, isTestCase) => {
  if (language === "cpp") return executeCpp(filePath, isTestCase);
  if (language === "py") return executePy(filePath);
};

const executePy = async (filePath) => {
  const command = `python3 ${filePath}`;

  const { stdout, stderr } = await exec(command);
  if (stderr) {
    return { status: "error", output: stderr };
  }
  return { status: "success", output: stdout };
};

const executeCpp = async (filePath, isTestCase) => {
  const jobId = path.basename(filePath).split(".")[0];
  const outputPath = path.join(outputsDir, `${jobId}.out`);

  let command = `g++ ${filePath} -o ${outputPath} && cd ${outputsDir} && ./${jobId}.out`;

  if (isTestCase) {
    const testCaseInputFilePath = path.join(testCasesDir, `${jobId}_input.txt`);
    const testCaseExpectedOutputFilePath = path.join(
      testCasesDir,
      `${jobId}_output.txt`
    );
    command += ` < ${testCaseInputFilePath}`;
  }

  const { stdout, stderr } = await exec(command);
  if (stderr) {
    return { status: "error", output: stderr };
  }
  return { status: "success", output: stdout };
};

module.exports = { executeCode };
