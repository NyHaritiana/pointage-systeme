const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectionDB');
const Department = require('./Department');

const Employee = sequelize.define('Employee', {
    id_employee: {
        type: DataTypes.BIGINT,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    num_matricule: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    num_cnaps: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CIN: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: true
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sexe: {                         //ENUM
        type: DataTypes.STRING,
        allowNull: false
    },
    etat_civil: {                   //ENUM
        type: DataTypes.STRING,
        allowNull: false
    },
    date_naissance: {
        type: DataTypes.DATE,
        allowNull: false
    },
    date_embauche: {
        type: DataTypes.DATE,
        allowNull: false
    },
    contrat: {                      //ENUM
        type: DataTypes.STRING,     
        allowNull: false
    },
    statut: {                       //ENUM
        type: DataTypes.STRING,     
        allowNull: false
    },
    categorie: {                    //ENUM
        type: DataTypes.STRING,     
        allowNull: false
    },
    groupe: {                       //ENUM
        type: DataTypes.STRING,     
        allowNull: false
    },
    localité: {
        type: DataTypes.STRING,     
        allowNull: false
    },
    adresse: {
        type: DataTypes.STRING,     
        allowNull: false
    },
    fonction: {
        type: DataTypes.STRING,     
        allowNull: false
    },
    projet: {
        type: DataTypes.STRING,     
        allowNull: true
    },
    situation_matrimonialle: {      //ENUM
        type: DataTypes.STRING,     
        allowNull: false
    },
    nb_enfant: {
        type: DataTypes.INTEGER,     
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,     
        allowNull: true
    },
    salaire: {
        type: DataTypes.FLOAT,     
        allowNull: false
    },
    id_departement: {
        type: DataTypes.BIGINT,     
        references: {
            model: Department,
            key: 'id_departement'
        }
    }
}, {
    tableName: 'EMPLOYEE',
    timestamps: false,
    freezeTableName: true
});

Department.hasMany(Employee, { foreignKey: 'id_departement' });
Employee.belongsTo(Department, { foreignKey: 'id_departement' });

sequelize.sync()
  .then(() => {
    console.log('Table EMPLOYEE synchronisée avec succès.');
  })
  .catch((err) => {
    console.error('Erreur de synchronisation :', err);
  });

module.exports = Employee;