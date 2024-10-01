import express from "express";
import {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/order.js";
import { verifySuperAdminToken } from "../middlewares/superadmin.js";
import { verifyToken } from "../middlewares/authentication.js";

const router = express.Router();

// SUPERADMIN
router.get("/", verifySuperAdminToken, getAllOrders);

// USER
router.post("/", verifyToken, createOrder);
router.get("/:order_id", getOrderById);
router.patch("/:order_id", updateOrder);
router.delete("/:order_id", deleteOrder);

export default router;
