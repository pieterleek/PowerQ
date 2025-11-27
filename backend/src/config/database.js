const { Sequelize } = require('sequelize');
require('dotenv').config();

// Clean Code: Haal credentials altijd uit process.env, nooit hardcoden
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false, // Zet op console.log om SQL queries te zien tijdens dev
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

module.exports = sequelize;