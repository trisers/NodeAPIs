import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

// Connect Databse
connectDB();

// Middleware
let corsOption = {
  origin: ["http://localhost:3000"], // Replace with the allowed origin(s)
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Enable cookies and authorization headers
};
app.use(cors(corsOption)); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(morgan("dev")); // Log requests to the console

// Serve the 'uploads' folder statically
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Basic Routes
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the NodeJs API!</h1>");
});

// importing all defined routes
app.use("/api", routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
