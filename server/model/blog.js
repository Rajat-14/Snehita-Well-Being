const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Blog = sequelize.define('Blog', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    link: {
        type: DataTypes.TEXT, // Links can be long
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pic: {
        type: DataTypes.STRING, // Storing path or URL
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Blog;
