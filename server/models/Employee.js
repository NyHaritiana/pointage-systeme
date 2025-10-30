const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectionDB');
const Department = require('./Department');

const Employee = sequelize.define('Employee', {
    id_employee: {
        type: DataTypes.BIGINT,
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
        type: DataTypes.ENUM('Male', 'Femelle'),
        allowNull: false
    },
    etat_civil: {                   //ENUM
        type: DataTypes.ENUM('Celibataire', 'Marie'),
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
        type: DataTypes.ENUM('CDI', 'CDD', 'Stage'),     
        allowNull: false
    },
    statut: {                       //ENUM
        type: DataTypes.ENUM('Employee', 'Cadre', 'Cadre supérieur'),     
        allowNull: false
    },
    categorie: {                    //ENUM
        type: DataTypes.ENUM('1A', '2A', '3A', '4A', '5A', '1B', '2B', '3B', '4B', '5B', 'HC'),     
        allowNull: false
    },
    groupe: {                       //ENUM
        type: DataTypes.ENUM('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'),     
        allowNull: false
    },
    localite: {
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

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Table EMPLOYEE synchronisée avec succès.');
  })
  .catch((err) => {
    console.error('Erreur de synchronisation :', err);
  });

module.exports = Employee;