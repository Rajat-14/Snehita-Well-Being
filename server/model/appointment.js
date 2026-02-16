const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const User = require('./userSchema');

const Appointment = sequelize.define('Appointment', {
    // Client Info
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mobileNumber: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Problem Details
    problemDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    problemExtent: {
        type: DataTypes.STRING, // e.g. 'Mild', 'Moderate', 'Severe' or duration
        allowNull: true
    },
    problemRelatedWith: {
        type: DataTypes.STRING,
        allowNull: true
    },
    modeOfReferral: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Appointment Details
    appointmentDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    timeSlot: {
        type: DataTypes.STRING,
        allowNull: false
    },
    durationPeriod: {
        type: DataTypes.STRING, // e.g., '30 mins', '1 hour' - likely filled by counselor or default
        allowNull: true
    },
    counselorName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // Status & Notes
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
        defaultValue: 'pending'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Notes filled by counselor after session'
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
    tableName: 'Appointments'
});

// Define association
Appointment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Appointment, { foreignKey: 'userId' });

module.exports = Appointment;
