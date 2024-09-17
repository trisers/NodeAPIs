import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.js";
import { verifySuperAdminToken } from "../middlewares/superadmin.js";
import { uploadMultipleFiles } from "../config/multer.js";

const router = express.Router();

const uploadGallery = uploadMultipleFiles("/uploads/products", "gallery", 10);

router.post("/", verifySuperAdminToken, uploadGallery, createProduct);
router.get("/", getAllProducts);

router.get("/:product_id", getProduct);
router.put("/:product_id", verifySuperAdminToken, uploadGallery, updateProduct);
router.delete("/:product_id", verifySuperAdminToken, deleteProduct);

export default router;
