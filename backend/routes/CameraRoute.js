import express from "express";
import {
  getCameras,
  getCameraById,
  createCamera,
  updateCamera,
  deleteCamera,
} from "../controllers/CameraController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCameras);
router.get("/:id", getCameraById);
router.post("/", verifyToken, createCamera);
router.patch("/:id", verifyToken, updateCamera);
router.delete("/:id", verifyToken, deleteCamera);

export default router;
