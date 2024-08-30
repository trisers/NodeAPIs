import express from "express";
import exampleRoutes from "./route.example.js"; // Import other route files

const routes = express.Router();

// Use imported routes
routes.use("/example", exampleRoutes);

// Add more routes here as needed
// router.use('/anotherRoute', anotherRouteFile);

export default routes;
