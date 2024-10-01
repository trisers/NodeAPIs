import express from "express";
import {
  createBlog,
  deleteBlog,
  fetchAllBlogs,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
} from "../controllers/blog.js";
import { createMulter } from "../config/multer.js";
import { verifySuperAdminToken } from "../middlewares/superadmin.js";

const router = express.Router();
const uploadThumbnail = createMulter("uploads/blogs");

// SUPERADMIN
router.get("/all", verifySuperAdminToken, fetchAllBlogs);
router.post("/",verifySuperAdminToken, uploadThumbnail.single("thumbnail"), createBlog);
router.put("/:id",verifySuperAdminToken, uploadThumbnail.single("thumbnail"), updateBlog);
router.delete("/:id",verifySuperAdminToken, deleteBlog);

// USER
router.get("/", getAllBlogs);
router.get("/:slug", getBlogBySlug);

export default router;
