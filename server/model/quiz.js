const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Quiz = sequelize.define('Quiz', {
    heading: {
        type: DataTypes.STRING,
        allowNull: false
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Quiz;
