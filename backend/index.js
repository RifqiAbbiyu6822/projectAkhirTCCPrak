import express from "express";
import cors from "cors";
import db from "./config/database.js";

import "./models/User.js";
import "./models/Camera.js";
import "./models/Transaction.js";
import profileRoutes from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import CameraRoute from "./routes/CameraRoute.js";
import TransactionRoute from "./routes/TransactionRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", AuthRoute);
app.use("/cameras", CameraRoute);
app.use("/transactions", TransactionRoute);
app.use("/users", profileRoutes);

const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await db.authenticate();
    console.log("Database connected.");

    // Tidak ada sync() di sini, Sequelize tidak buat atau ubah tabel

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();
