const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const User = require('./userSchema');

const CounselorAppointment = sequelize.define('CounselorAppointment', {
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

// Define association (Counselor might view user details)
CounselorAppointment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = CounselorAppointment;
