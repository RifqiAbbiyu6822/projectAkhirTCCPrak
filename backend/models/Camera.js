import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Camera = db.define('cameras', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  brand: { type: DataTypes.STRING(50), allowNull: false },
  model: { type: DataTypes.STRING(100), allowNull: false },
  type: { type: DataTypes.ENUM('SLR','Rangefinder','Point-and-Shoot','TLR'), allowNull: false },
  year_released: { type: DataTypes.INTEGER },
  format: { type: DataTypes.STRING(50) },
  price: { type: DataTypes.DECIMAL(10, 2) },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  image_link: { type: DataTypes.STRING(255), allowNull: false }
}, {
  timestamps: false,
  freezeTableName: true
});

export default Camera;
