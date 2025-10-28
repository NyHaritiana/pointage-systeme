import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Department = sequelize.define(
  "Department",
  {
    id_departement: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sigle: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    tableName: "DEPARTEMENT",
    timestamps: true,
  }
);

export default Department;
