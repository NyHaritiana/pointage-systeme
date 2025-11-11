const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectionDB');

const Horaire = sequelize.define('Horaire', {
  id_horaire: {           
    type: DataTypes.BIGINT,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  semaine: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  heure_entree: {
    type: DataTypes.TIME,
    allowNull: false
  },
  heure_sortie: {
    type: DataTypes.TIME,
    allowNull: false
  }
}, {
  tableName: 'HORAIRE',
  timestamps: false,
  freezeTableName: true
});

sequelize.sync()
  .then(() => {
    console.log('Table HORAIRE synchronisée avec succès.');
  })
  .catch((err) => {
    console.error('Erreur de synchronisation :', err);
  });

module.exports = Horaire;
