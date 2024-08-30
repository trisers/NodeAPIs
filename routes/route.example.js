import express from "express";
import {
  getExample,
  createExample,
  updateExample,
  deleteExample,
} from "../controllers/controller.example.js";

const router = express.Router();

router.get("/", getExample);
router.post("/", createExample);
router.put("/:id", updateExample);
router.delete("/:id", deleteExample);

export default router;
