import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
} from "../controllers/blog.js";
import { createMulter } from "../config/multer.js";

const router = express.Router();
const uploadThumbnail = createMulter("uploads/blogs");

router.post("/", uploadThumbnail.single("thumbnail"), createBlog);
router.get("/", getAllBlogs);
router.get("/:slug", getBlogBySlug);
router.put(
  "/:id",
  uploadThumbnail.single("thumbnail"),

  updateBlog
);
// router.delete("/:id");

export default router;
