import Transaction from "../models/Transaction.js";
import Camera from "../models/Camera.js";
import { Op } from "sequelize";
import db from "../config/database.js";

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Camera,
        attributes: ['brand', 'model', 'price']
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    console.error('Error in getTransactions:', error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: [{
        model: Camera,
        attributes: ['brand', 'model', 'price']
      }]
    });
    if (!transaction) return res.status(404).json({ msg: "Transaction not found" });
    res.json(transaction);
  } catch (error) {
    console.error('Error in getTransactionById:', error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const createTransaction = async (req, res) => {
  const t = await db.transaction();

  try {
    const { cameraId, quantity = 1, transaction_type = 'purchase', transaction_date } = req.body;
    
    if (!cameraId || quantity < 1) {
      return res.status(400).json({ msg: "Invalid camera ID or quantity" });
    }

    // Get camera and check stock
    const camera = await Camera.findByPk(cameraId, { transaction: t });
    if (!camera) {
      await t.rollback();
      return res.status(404).json({ msg: "Camera not found" });
    }
    
    if (camera.stock < quantity) {
      await t.rollback();
      return res.status(400).json({ msg: "Insufficient stock" });
    }

    // Calculate total price
    const total_price = camera.price * quantity;

    // Create transaction
    const newTransaction = await Transaction.create({
      user_id: req.user.id,
      camera_id: cameraId,
      transaction_type: transaction_type,
      transaction_date: transaction_date || new Date(),
      quantity,
      total_price
    }, { transaction: t });

    // If this is a purchase, reduce stock immediately
    if (transaction_type === 'purchase') {
      await Camera.update(
        { stock: camera.stock - quantity },
        { 
          where: { id: cameraId },
          transaction: t 
        }
      );
    }

    await t.commit();

    // Fetch the complete transaction with camera details
    const completeTransaction = await Transaction.findOne({
      where: { id: newTransaction.id },
      include: [{
        model: Camera,
        attributes: ['brand', 'model', 'price']
      }]
    });

    res.status(201).json(completeTransaction);
  } catch (error) {
    await t.rollback();
    console.error('Error in createTransaction:', error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const updateTransaction = async (req, res) => {
  const t = await db.transaction();

  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: [{
        model: Camera
      }],
      transaction: t
    });

    if (!transaction) {
      await t.rollback();
      return res.status(404).json({ msg: "Transaction not found" });
    }

    // If updating from 'cart' to 'purchase' type, check and update stock
    if (req.body.transaction_type === 'purchase' && transaction.transaction_type !== 'purchase') {
      const camera = await Camera.findByPk(transaction.camera_id, { transaction: t });
      
      if (!camera) {
        await t.rollback();
        return res.status(404).json({ msg: "Camera not found" });
      }

      if (camera.stock < transaction.quantity) {
        await t.rollback();
        return res.status(400).json({ msg: "Insufficient stock" });
      }

      // Update camera stock
      await Camera.update(
        { stock: camera.stock - transaction.quantity },
        { 
          where: { id: transaction.camera_id },
          transaction: t 
        }
      );
    }

    // Update the transaction
    const [updated] = await Transaction.update(req.body, {
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      transaction: t
    });

    if (!updated) {
      await t.rollback();
      return res.status(404).json({ msg: "Transaction not found" });
    }

    await t.commit();
    res.json({ msg: "Transaction updated successfully" });
  } catch (error) {
    await t.rollback();
    console.error('Error in updateTransaction:', error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.destroy({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!deleted) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    res.json({ msg: "Transaction deleted successfully" });
  } catch (error) {
    console.error('Error in deleteTransaction:', error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};