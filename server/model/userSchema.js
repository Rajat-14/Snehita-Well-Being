const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

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
  entryNumber: {
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
  profilePic: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Base64-encoded profile photo stored directly in DB'
  },
  isStarred: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Global star marker for patients by counselors'
  }
}, {
  timestamps: true
});

module.exports = User;
