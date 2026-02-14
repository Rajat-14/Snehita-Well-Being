const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const User = require('./userSchema');

const Role = sequelize.define('Role', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
            model: User,
            key: 'email'
        }
    },
    role: {
        type: DataTypes.ENUM('client', 'counselor', 'admin'),
        defaultValue: 'client',
        allowNull: false
    }
}, {
    timestamps: true
});

User.hasOne(Role, { foreignKey: 'email', sourceKey: 'email' });
Role.belongsTo(User, { foreignKey: 'email', targetKey: 'email' });

module.exports = Role;
