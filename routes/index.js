import express from "express";
import productRoutes from "../routes/product.js";
const routes = express.Router();

// Use imported routes
routes.use("/product", productRoutes);

// Add more routes here as needed
// router.use('/anotherRoute', anotherRouteFile);

export default routes;
