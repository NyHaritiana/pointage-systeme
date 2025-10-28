import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";

dotenv.config();
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);

sequelize
  .sync({ alter: true })
  .then(() => console.log("Base de données synchronisée"))
  .catch((err) => console.error("Erreur DB:", err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
