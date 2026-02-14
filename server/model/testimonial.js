const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Testimonial = sequelize.define('Testimonial', {
    name: {
        type: DataTypes.STRING,
        allowNull: true, // Some are anonymous
        defaultValue: "Anonymous"
    },
    testimony: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    pic: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Testimonial;
