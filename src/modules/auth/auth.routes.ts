import express from "express";
import { validateRegister, validateLogin } from "./auth.validation";
import { register, login } from "./auth.controller";
import { RequestHandler } from "express";
import { googleAuth } from "./auth.controller";

const router = express.Router();

/* 🚀 Basic Authentication */
router.post("/register", validateRegister as RequestHandler[], register);
router.post("/login", validateLogin as RequestHandler[], login);

/* 🔑 Third-Party Authentication */
router.post("/google", googleAuth);
// router.post("/auth/phone", phoneAuth);
// router.post("/auth/other", otherAuth);

/* 🔄 Token Management */
// router.post("/auth/refresh", refreshToken);
// router.post("/auth/logout", logout);

/* 🔒 Password Recovery */
// router.post("/auth/forgot-password", forgotPassword);
// router.post("/auth/reset-password", resetPassword);

/* ✅ Email Verification */
// router.post("/auth/verify-email", verifyEmail);
// router.post("/auth/resend-verification", resendVerificationEmail);

/* 📲 OTP-Based Authentication */
// router.post("/auth/send-otp", sendOTP);
// router.post("/auth/verify-otp", verifyOTP);

/* 🔐 Two-Factor Authentication (2FA) */
// router.post("/auth/enable-2fa", enable2FA);
// router.post("/auth/disable-2fa", disable2FA);

/* 🔄 Account Security */
// router.post("/auth/change-password", changePassword);
// router.put("/auth/update-profile", updateProfile);
// router.get("/auth/profile", getUserProfile);

export default router;
