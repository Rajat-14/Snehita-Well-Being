const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const UsefulLink = sequelize.define('UsefulLink', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('link', 'phone'),
        allowNull: false
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: true // it could just be a phone number stored here, or actual URL
    },
    pic: {
        type: DataTypes.STRING, // filename for the image if type === 'link'
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = UsefulLink;
