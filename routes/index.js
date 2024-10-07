import express from "express";
import productRoutes from "./product.js";
import orderRoutes from "./order.js";
import authRoutes from "./authentication.js";
import userRoutes from "./user.js";
import capabilitiesRoutes from "./capabilities.js";
import dashboardUserRoutes from "./dashboard-user.js";
import collectionRoutes from "./collection.js";
import blogRoutes from "./blog.js";
import { verifySuperAdminToken } from "../middlewares/superadmin.js";
import { checkAccess } from "../middlewares/authentication.js";
const routes = express.Router();

// Use imported routes
routes.use("/product", checkAccess, productRoutes);
routes.use("/order", orderRoutes);
routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/capabilities", checkAccess, capabilitiesRoutes);
routes.use("/dashboard-user", checkAccess, dashboardUserRoutes);
routes.use("/collection", checkAccess, collectionRoutes);
routes.use("/blog", checkAccess, blogRoutes);

// Add more routes here as needed
// router.use('/anotherRoute', anotherRouteFile);

export default routes;
