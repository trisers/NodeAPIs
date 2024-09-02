import express from "express";
import {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/order.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);

router.get("/:order_id", getOrderById);
router.patch("/:order_id", updateOrder);
router.delete("/:order_id", deleteOrder);

export default router;
