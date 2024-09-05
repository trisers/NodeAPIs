import express from "express";
import { changePassword, updateProfile } from "../controllers/user.js";
import { verifyToken } from "../middlewares/authentication.js";

const router = express.Router();

router.put("/update-profile", verifyToken, updateProfile);
router.put("/change-password", verifyToken, changePassword);

export default router;
