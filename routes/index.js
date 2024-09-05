import express from "express";
import productRoutes from "../routes/product.js";
import orderRoutes from "../routes/order.js";
import authRoutes from "../routes/authentication.js";
import userRoutes from "../routes/user.js";
const routes = express.Router();

// Use imported routes
routes.use("/product", productRoutes);
routes.use("/order", orderRoutes);
routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);

// Add more routes here as needed
// router.use('/anotherRoute', anotherRouteFile);

export default routes;
