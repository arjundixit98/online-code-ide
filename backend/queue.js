require("dotenv").config();
const Queue = require("bull");

let jobQueue; // Declare jobQueue variable

// Function to initialize the queue
const initQueue = () => {
  if (!jobQueue) {
    jobQueue = new Queue("job-queue", process.env.REDIS_CONNECTION_STRING);
    console.log("Job queue is ready!"); // Log readiness once
  }
  return jobQueue; // Return the initialized queue
};

const addJobToQueue = async (jobId, isTestCase) => {
  const queue = initQueue(); // Ensure queue is initialized
  await queue.add({ id: jobId, isTestCase });
};

module.exports = {
  initQueue,
  addJobToQueue,
};
