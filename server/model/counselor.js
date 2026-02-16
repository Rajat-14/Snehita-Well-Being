const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const Role = require('./role');

const Counselor = sequelize.define('Counselor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Role,
            key: 'email'
        }
    }
}, {
    timestamps: true
});

// Associations
Role.hasOne(Counselor, { foreignKey: 'email', sourceKey: 'email' });
Counselor.belongsTo(Role, { foreignKey: 'email', targetKey: 'email' });

module.exports = Counselor;
