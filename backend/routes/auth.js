import express from "express";
import { forgotPassword, login, refreshToken, resetPassword } from "../controllers/auth.js"

const router = express.Router();

router.post('/login', login)
router.post('/refresh-token', refreshToken)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router;