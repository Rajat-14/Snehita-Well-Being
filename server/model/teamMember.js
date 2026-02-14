const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const TeamMember = sequelize.define('TeamMember', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Type of team member: buddy, faculty_advisor, counsellor, dean'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    telephoneNo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    experience: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    academicDesignation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'JSON string containing an array of message strings'
    },
    course: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'For buddies - their course'
    },
    instaId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    linkedinId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = TeamMember;
