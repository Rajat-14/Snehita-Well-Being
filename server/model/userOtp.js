const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const validator = require('validator');

const UserOtp = sequelize.define('UserOtp', {
  otp: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: "Not Valid Email" }
    }
  },
  isOtpVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true // Implicitly adds createdAt and updatedAt
});

module.exports = UserOtp;