const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectionDB');
const Employee = require('./Employee');

const User = sequelize.define('User', {
  id_user: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'employe', 'rh'),
    allowNull: false,
    defaultValue: 'employe',
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
}, {
  tableName: 'USER',
  timestamps: false,
  freezeTableName: true,
});

Employee.hasOne(User, { foreignKey: 'id_employee' });
User.belongsTo(Employee, { foreignKey: 'id_employee' });

sequelize.sync({ alter: true })
  .then(() => console.log('Table USER synchronisée avec succès.'))
  .catch((err) => console.error('Erreur de synchronisation USER :', err));

module.exports = User;
