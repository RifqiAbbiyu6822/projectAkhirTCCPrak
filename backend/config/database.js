import { Sequelize } from "sequelize";

const db = new Sequelize('analog_camera_db', 'root', '', {
  host: '34.55.135.215',
  dialect: 'mysql',
  port: 3306,
  logging: (sql) => {
    if (sql.startsWith("CREATE TABLE") || sql.startsWith("ALTER TABLE")) {
      console.log("[DDL QUERY]:", sql);
    }
  },
});

export default db;
