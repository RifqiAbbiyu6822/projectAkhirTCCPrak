import express from "express";
import { getProfile, updateProfile, deleteProfile } from "../controllers/UserController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // Update import path sesuai struktur folder Anda

const router = express.Router();

// Get user profile
router.get("/profile", verifyToken, getProfile);

// Update user profile
router.put("/profile", verifyToken, updateProfile);

// Delete user account
router.delete("/profile", verifyToken, deleteProfile);

export default router;