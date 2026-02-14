const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  person_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Name is required" }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: "Email is required" },
      isEmail: { msg: "Must be a valid email" }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Password is required" },
      len: { args: [6, 100], msg: "Password must be at least 6 characters" }
    }
  }
}, {
  timestamps: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

module.exports = User;
