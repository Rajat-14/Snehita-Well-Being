const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const bcrypt = require('bcrypt');
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
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    hooks: {
        beforeSave: async (counselor) => {
            if (counselor.changed('password')) {
                counselor.password = await bcrypt.hash(counselor.password, 10);
            }
        }
    }
});

Role.hasOne(Counselor, { foreignKey: 'email', sourceKey: 'email' });
Counselor.belongsTo(Role, { foreignKey: 'email', targetKey: 'email' });

module.exports = Counselor;
