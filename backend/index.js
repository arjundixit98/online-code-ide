const express = require("express");
const cors = require("cors");
const PORT = 8000;
const app = express();
const mongoose = require("mongoose");
const MONGOURI = "mongodb://127.0.0.1:27017/online-compiler";
const { generateFile } = require("./generateFile");
const { addJobToQueue } = require("./jobQueue");
const Job = require("./models/job");
const problemRoute = require("./routes/problem");

mongoose
  .connect(MONGOURI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
  });

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/problems", problemRoute);

app.get("/", (req, res) => {
  return res.status(200).send("<h1>hello from backend<h1>");
  return res.status(200).json({ msg: "hello world" });
});

app.get("/status", async (req, res) => {
  const jobId = req.query.id;
  console.log("status requested for", jobId);

  if (jobId == undefined) {
    return res
      .status(400)
      .json({ success: false, error: "missing id query param" });
  }

  try {
    const job = await Job.findById(jobId);
    if (job == undefined) {
      return res.status(404).json({ success: false, error: "invalid job id" });
    }
    return res.status(200).json({ success: true, job });
  } catch (err) {
    return res.status(400).json({ success: false, error: JSON.stringify(err) });
  }
});

// app.post("/quick-run", async (req, res) => {
//   const { language, code } = req.body;
//   if (!language || !code)
//     return res.status(400).json({ error: "Code or language is empty" });

//   try {
//     //need to generate a c++ file with contents from the request
//     const filePath = await generateFile(language, code);
//     const job = await Job.create({ language, filePath });
//     const jobId = job["_id"];
//     addJobToQueue(jobId, (isTestCase = false));
//     // console.log(job);

//     return res.status(201).json({ success: true, jobId });
//   } catch (err) {
//     return res.status(500).json({ success: false, error: JSON.stringify(err) });
//   }
// });

app.post("/run", async (req, res) => {
  const { language, code, problemId } = req.body;
  let isTestCase = true;
  if (!problemId) isTestCase = false;

  if (!language || !code)
    return res.status(400).json({ error: "Code or language is empty" });

  try {
    //need to generate a c++ file with contents from the request
    const filePath = await generateFile(language, code, problemId);
    const job = await Job.create({ language, filePath });
    const jobId = job["_id"];
    addJobToQueue(jobId, isTestCase);
    // console.log(job);

    return res.status(201).json({ success: true, jobId });
  } catch (err) {
    return res.status(500).json({ success: false, error: JSON.stringify(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at port : ${PORT}`);
});
