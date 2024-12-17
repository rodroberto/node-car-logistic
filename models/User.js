// src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ensure this path is correct

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, // This ensures password must be provided
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'User', // Default role
  },
}, {
  // Optionally, enable snake_case for all fields
  underscored: true,
});

module.exports = User;
