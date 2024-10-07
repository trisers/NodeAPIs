import express from "express";
import {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/order.js";
import { verifySuperAdminToken } from "../middlewares/superadmin.js";
import { checkAccess } from "../middlewares/authentication.js";

const router = express.Router();

// SUPERADMIN
router.get("/", checkAccess, getAllOrders);

// USER
router.post("/", checkAccess, createOrder);
router.get("/:order_id", getOrderById);
router.patch("/:order_id", updateOrder);
router.delete("/:order_id", deleteOrder);

export default router;
