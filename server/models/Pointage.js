const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectionDB');
const Employee = require('./Employee');

const Pointage = sequelize.define('Pointage', {
  id_pointage: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  id_employee: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Employee,
      key: 'id_employee',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  date_pointage: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  heure_arrivee: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  heure_depart: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  statut: {
    type: DataTypes.ENUM('Présent', 'Absent', 'Retard', 'Permission'),
    allowNull: false,
    defaultValue: 'Présent',
  }
}, {
  tableName: 'POINTAGE',
  timestamps: false,
  freezeTableName: true,
});

Employee.hasMany(Pointage, { foreignKey: 'id_employee' });
Pointage.belongsTo(Employee, { foreignKey: 'id_employee' });

sequelize.sync({ alter: true })
  .then(() => console.log('Table POINTAGE synchronisée avec succès.'))
  .catch((err) => console.error('Erreur de synchronisation POINTAGE :', err));

module.exports = Pointage;
