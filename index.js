import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT;
// Connect Databse
connectDB();

// Basic Routes
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the NodeJs API!</h1>");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
