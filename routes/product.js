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
import { checkAccess } from "../middlewares/authentication.js";

const router = express.Router();

const uploadGallery = uploadMultipleFiles("/uploads/products", "gallery", 10);

// SUPERADMIN
router.post("/", checkAccess, uploadGallery, createProduct);
router.get("/code", checkAccess, getUniqueProductCode);
router.put("/:product_id", checkAccess, uploadGallery, updateProduct);
router.delete("/:product_id", checkAccess, deleteProduct);

// USER
router.get("/", getAllProducts);
router.get("/:slug", getProduct);

export default router;
