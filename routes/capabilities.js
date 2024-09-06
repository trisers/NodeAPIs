import express from "express";
import {
  createCapability,
  deleteCapability,
  getAllCapabilities,
  getCapabilityById,
  updateCapability,
} from "../controllers/capabilities.js";

const router = express.Router();

router.post("/", createCapability);
router.get("/", getAllCapabilities);

router.get("/:id", getCapabilityById);
router.patch("/:id", updateCapability);
router.delete("/:id", deleteCapability);

export default router;
