import { DataTypes } from "sequelize";
import db from "../config/database.js";
import User from "./User.js";
import Camera from "./Camera.js";

const Transaction = db.define('transactions', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  camera_id: { type: DataTypes.INTEGER, allowNull: false },
  transaction_type: { type: DataTypes.ENUM('cart', 'purchase', 'rental'), allowNull: false },
  transaction_date: { type: DataTypes.DATEONLY, allowNull: false },
  return_date: { type: DataTypes.DATEONLY },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  total_price: { type: DataTypes.DECIMAL(10,2) },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  freezeTableName: true
});

// Relasi
Transaction.belongsTo(User, { foreignKey: 'user_id' });
Transaction.belongsTo(Camera, { foreignKey: 'camera_id' });

export default Transaction;
