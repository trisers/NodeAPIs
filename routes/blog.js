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
import { checkAccess } from "../middlewares/authentication.js";

const router = express.Router();
const uploadThumbnail = createMulter("/uploads/blogs");

// SUPERADMIN
router.get("/all", checkAccess, fetchAllBlogs);
router.post("/",checkAccess, uploadThumbnail.single("thumbnail"), createBlog);
router.put("/:id",checkAccess, uploadThumbnail.single("thumbnail"), updateBlog);
router.delete("/:id",checkAccess, deleteBlog);

// USER
router.get("/", getAllBlogs);
router.get("/:slug", getBlogBySlug);

export default router;
