import express from "express";
import {
  addDashboardUser,
  updateDashboardUser,
} from "../controllers/dashboard-user.js";

const router = express.Router();

router.post("/", addDashboardUser);
router.patch("/", updateDashboardUser);

export default router;
