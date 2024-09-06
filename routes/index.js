import express from "express";
import productRoutes from "./product.js";
import orderRoutes from "./order.js";
import authRoutes from "./authentication.js";
import userRoutes from "./user.js";
import capabilitiesRoutes from "./capabilities.js";
import dashboardUserRoutes from "./dashboard-user.js";
import { verifySuperAdminToken } from "../middlewares/superadmin.js";
const routes = express.Router();

// Use imported routes
routes.use("/product", productRoutes);
routes.use("/order", orderRoutes);
routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/capabilities", verifySuperAdminToken, capabilitiesRoutes);
routes.use("/dashboard-user", verifySuperAdminToken, dashboardUserRoutes);

// Add more routes here as needed
// router.use('/anotherRoute', anotherRouteFile);

export default routes;
