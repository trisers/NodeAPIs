import express from "express";
import productRoutes from "../routes/product.js";
import orderRoutes from "../routes/order.js";
const routes = express.Router();

// Use imported routes
routes.use("/product", productRoutes);
routes.use("/order", orderRoutes);

// Add more routes here as needed
// router.use('/anotherRoute', anotherRouteFile);

export default routes;
