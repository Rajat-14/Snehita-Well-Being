const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    // dialectOptions: { // SSL is needed for production (e.g. Heroku), but not local
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false
    //     }
    // }
});

module.exports = sequelize;
