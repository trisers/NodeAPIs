import express from "express";
import {
  login,
  requestOTP,
  resendOtp,
  resetPassword,
  userRegister,
  verifyEmail,
} from "../controllers/authentication.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/verify-email", verifyEmail);
router.post("/resend-confirmation", resendOtp);
router.post("/login", login);
router.post("/request-confirmation", requestOTP);
router.post("/reset-password", resetPassword);

export default router;
