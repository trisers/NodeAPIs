import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  getUniqueProductCode,
  updateProduct,
} from "../controllers/product.js";
import { verifySuperAdminToken } from "../middlewares/superadmin.js";
import { uploadMultipleFiles } from "../config/multer.js";

const router = express.Router();

const uploadGallery = uploadMultipleFiles("/uploads/products", "gallery", 10);

// SUPERADMIN
router.post("/", verifySuperAdminToken, uploadGallery, createProduct);
router.get("/code", verifySuperAdminToken, getUniqueProductCode);
router.put("/:product_id", verifySuperAdminToken, uploadGallery, updateProduct);
router.delete("/:product_id", verifySuperAdminToken, deleteProduct);

// USER
router.get("/", getAllProducts);
router.get("/:slug", getProduct);

export default router;
