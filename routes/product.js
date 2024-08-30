import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getAllProducts);

router.get("/:product_id", getProduct);
router.put("/:product_id", updateProduct);
router.delete("/:product_id", deleteProduct);

export default router;
