const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectionDB');
const Employee = require('./Employee');

const Absence = sequelize.define('Absence', {
  id_absence: {
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
  date_debut: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  date_fin: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  type_absence: {
    type: DataTypes.ENUM('Conge Paye', 'Arret Maladie', 'Permission', 'Conge de Maternite', 'Conge de Paternite', 'Assistance Maternelle', 'Conge Formation', 'Mission'),
    allowNull: false,
  },
  motif: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  statut: {
    type: DataTypes.ENUM('En attente', 'Approuve', 'Rejete'),
    defaultValue: 'En attente',
    allowNull: false,
  },
}, {
  tableName: 'ABSENCE',
  timestamps: false,
  freezeTableName: true,
});

Employee.hasMany(Absence, { foreignKey: 'id_employee' });
Absence.belongsTo(Employee, { foreignKey: 'id_employee' });

sequelize.sync({ alter: true })
  .then(() => console.log('Table ABSENCE synchronisée avec succes.'))
  .catch((err) => console.error('Erreur de synchronisation ABSENCE :', err));

module.exports = Absence;
