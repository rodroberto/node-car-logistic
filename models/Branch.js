// src/models/Branch.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Branch = sequelize.define('Branch', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,  // You can also use STRING if the year is stored as text
    allowNull: false,
  },
  make: {
    type: DataTypes.ENUM('Toyota', 'Ford', 'Honda', 'Chevrolet', 'BMW'),
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employee_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users', // This references the 'Users' table
      key: 'id',
    },
    allowNull: false,
  },
}, {
  // Optionally, enable snake_case for all fields
  underscored: true,
});

Branch.belongsTo(User, { foreignKey: 'employee_id', as: 'user' });


module.exports = Branch;
