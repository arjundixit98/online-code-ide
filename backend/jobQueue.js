const Queue = require("bull");
const jobQueue = new Queue("job-queue");
const Job = require("./models/job");
const { executeCode } = require("./executeCode");
const NUM_WORKERS = 5;

jobQueue.process(NUM_WORKERS, async ({ data }) => {
  const { id: jobId, isTestCase } = data;
  const job = await Job.findById(jobId);
  if (job === undefined) {
    throw Error("job not found");
  }
  console.log("Fetched job", job);

  try {
    //we need to run the file and send the response
    job["startedAt"] = new Date();
    const { status, output } = await executeCode(
      job.language,
      job.filePath,
      isTestCase
    );
    job["completedAt"] = new Date();
    job["status"] = "success";
    job["output"] = output;
    await job.save();
  } catch (error) {
    console.log(error);
    job["completedAt"] = new Date();
    job["status"] = "error";
    job["output"] = JSON.stringify(error);
    await job.save();
  }

  return true;
});

jobQueue.on("failed", (error) => {
  console.log(error.data.id, "failed", error.failedReason);
});

const addJobToQueue = async (jobId, isTestCase) => {
  await jobQueue.add({ id: jobId, isTestCase });
};

module.exports = {
  addJobToQueue,
};
