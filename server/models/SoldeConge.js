const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectionDB');
const Employee = require('./Employee');

const SoldeConge = sequelize.define('SoldeConge', {
  id_solde: {
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
  },
  annee: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  solde_initial: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30,
  },
  solde_restant: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30,
  },
}, {
  tableName: 'SOLDE_CONGE',
  timestamps: false,
  freezeTableName: true,
});

Employee.hasMany(SoldeConge, { foreignKey: 'id_employee' });
SoldeConge.belongsTo(Employee, { foreignKey: 'id_employee' });

sequelize.sync({ alter: true })
  .then(() => console.log('Table SOLDE_CONGE synchronisée avec succès'))
  .catch(err => console.error(err));

module.exports = SoldeConge;
