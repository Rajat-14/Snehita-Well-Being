const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const User = require('./userSchema');

const Appointment = sequelize.define('Appointment', {
  fullName: {
    type: DataTypes.STRING
  },
  mobileNumber: {
    type: DataTypes.BIGINT, // Number in JS can be safe as BIGINT in SQL
    allowNull: false
  },
  emailAddress: {
    type: DataTypes.STRING
  },
  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  counselorName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  appointmentSlot: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  timestamps: true
});

// Define association
Appointment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Appointment, { foreignKey: 'userId' });

module.exports = Appointment;
