const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const User = require('./userSchema');

const ClientAppointment = sequelize.define('ClientAppointment', {
    fullName: {
        type: DataTypes.STRING
    },
    mobileNumber: {
        type: DataTypes.BIGINT,
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
    timestamps: true,
    tableName: 'Appointments' // Map to existing table
});

// Define association
ClientAppointment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(ClientAppointment, { foreignKey: 'userId' });

module.exports = ClientAppointment;
