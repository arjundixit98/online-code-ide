require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT;
const app = express();
// const MONGOURI = process.env.MONGO_DB_URL;
// const mongoose = require("mongoose");
const { connectDB } = require("./db");
const { generateFile } = require("./generateFile");
const { addJobToQueue } = require("./queue");
const Job = require("./models/job");
const User = require("./models/user");
const problemRoute = require("./routes/problem");
const cookieParser = require("cookie-parser");
const { generateToken, verifyToken } = require("./service/auth");

connectDB();

app.use(
  cors({
    origin: process.env.REACT_FRONTEND_URL, // Replace with your frontend's origin
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
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
app.post("/register", async (req, res) => {
  try {
    console.log("Request received");
    const { username, password } = req.body;
    //console.log(req.body);
    if (!username || !password) {
      return res.status(400).json({ error: "username or password is missing" });
    }

    const existingUser = await User.findOne({ username });
    //console.log(existingUser);
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", message: "Username already registered" });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    return res
      .status(201)
      .json({ status: "success", message: "user registered successfully" });
    // res.redirect("/login");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      status: "error",
      message: "An error occured while registering the user",
    });
  }
});

app.get("/auth/verify", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ status: "error", message: "no token found" });
    }

    const decoded = verifyToken(token);
    return res.status(200).json({
      status: "success",
      user: "token verified",
      username: decoded.username,
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    return res
      .status(401)
      .json({ status: "error", message: "Invalid or expired token" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "username or password is missing" });
    }

    const findUser = await User.findOne({ username, password });
    console.log(findUser);
    if (!findUser) {
      return res.status(400).json({
        status: "error",
        message: "username doesn't exist or password is wrong",
      });
    }
    const token = generateToken(findUser);
    console.log(token);
    res.cookie("token", token, {
      secure: true, // Use secure if your site uses HTTPS
      sameSite: "None",
    });

    return res.status(201).json({
      status: "success",
      message: "Successfully logged in",
    });
  } catch (error) {
    console.error("Error while logging in:", error);
    res.status(500).json({
      status: "error",
      message: "An error occured while logging in",
    });
  }
});

app.post("/logout", async (req, res) => {
  try {
    res.cookie("token", "", {
      expires: new Date(0),
      secure: true, // Use secure if your site uses HTTPS
      sameSite: "None",
    });
    // console.log(res.cookie?.token);
    return res
      .status(200)
      .json({ status: "success", message: "Logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Unable to logout" });
  }
});

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
