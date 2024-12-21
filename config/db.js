// This file is creating connection with database
const mysql = require("mysql2");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

const autDb = async (req, res) => {
  try {
    await sequelize.authenticate();
    console.log("DataBase connect successfully");
  } catch (error) {
    console.log("Failed to connect with database", error);
  }
};

autDb();
module.exports = sequelize;
