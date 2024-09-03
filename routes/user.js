import express from "express";
import { userRegister, verifyEmail } from "../controllers/authentication.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/verify-email", verifyEmail);

export default router;
