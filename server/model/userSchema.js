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
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
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
    allowNull: true,
  }
}, {
  timestamps: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password') && user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

module.exports = User;
