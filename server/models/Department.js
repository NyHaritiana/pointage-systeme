const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectionDB');

const Department = sequelize.define('Departement', {
  id_departement: {           
    type: DataTypes.BIGINT,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sigle: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'DEPARTEMENT',
  timestamps: false,
  freezeTableName: true
});

sequelize.sync()
  .then(() => {
    console.log('Table DEPARTEMENT synchronisée avec succès.');
  })
  .catch((err) => {
    console.error('Erreur de synchronisation :', err);
  });

module.exports = Department;
