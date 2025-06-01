import express from "express";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/TransactionController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getTransactions);
router.get("/:id", verifyToken, getTransactionById);
router.post("/", verifyToken, createTransaction);
router.patch("/:id", verifyToken, updateTransaction);
router.delete("/:id", verifyToken, deleteTransaction);

export default router;
