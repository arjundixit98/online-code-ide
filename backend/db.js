const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGOURI = process.env.MONGO_DB_URL; // Ensure you have your MongoDB URI in your .env file
    await mongoose.connect(MONGOURI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error", err);
    process.exit(1); // Exit the process if connection fails
  }
};

// Export the connectDB function
module.exports = { connectDB };
