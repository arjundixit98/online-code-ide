require("dotenv").config();
// const MONGOURI = process.env.MONGO_DB_URL;
// const mongoose = require("mongoose");
const { connectDB } = require("./db");
const { initQueue } = require("./queue"); // Import initQueue function
const jobQueue = initQueue(); // Initialize the job queue

// mongoose
//   .connect(MONGOURI)
//   .then(() => {
//     console.log("MongoDB connected");
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error", err);
//   });

connectDB();

const Job = require("./models/job");
const { executeCode } = require("./executeCode");
const NUM_WORKERS = 5;

console.log("Worker started and ready to process jobs");

jobQueue.process(NUM_WORKERS, async ({ data }) => {
  const { id: jobId, isTestCase } = data;
  // console.log(`jobId: ${jobId}`);

  const job = await Job.findById(jobId);
  // console.log(job);
  if (job === undefined) {
    throw Error("job not found");
  }
  console.log(`Processing job with jobId: ${jobId}`);

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
    console.error("Error processing job:", error);
    job["completedAt"] = new Date();
    job["status"] = "error";
    job["output"] = JSON.stringify(error);
    await job.save();
  }

  return true;
});

jobQueue.on("failed", (error) => {
  console.error(`Job ${error.data.id} failed: ${error.failedReason}`);
});

jobQueue.on("completed", (job) => {
  // console.log(job);
  console.log(`Job with jobId: ${job.data.id} successfully completed`);
});
