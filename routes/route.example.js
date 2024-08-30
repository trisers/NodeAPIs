import express from "express";
import {
  getExample,
  createExample,
  updateExample,
  deleteExample,
} from "../controllers/controllers.example.js";
import { createMulter } from "../config/multer.js";

const router = express.Router();

// use multer instance to upload image , modify folder name as per need
const uploadImages = createMulter("uploads/images");

router.get("/", getExample);
router.post("/", uploadImages.single("image"), createExample);
router.put("/:id", updateExample);
router.delete("/:id", deleteExample);

export default router;
