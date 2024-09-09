import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.js";
import { verifySuperAdminToken } from "../middlewares/superadmin.js";

const router = express.Router();

router.post("/", verifySuperAdminToken, createProduct);
router.get("/", getAllProducts);

router.get("/:product_id", getProduct);
router.put("/:product_id", verifySuperAdminToken, updateProduct);
router.delete("/:product_id", verifySuperAdminToken, deleteProduct);

export default router;
