const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Measurement = sequelize.define('Measurement', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    current: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    voltage: {
        type: DataTypes.FLOAT,
        defaultValue: 230.0
    },
    power: {
        type: DataTypes.FLOAT, // Wattage
        allowNull: false
    },
    // Sequelize voegt automatisch 'createdAt' en 'updatedAt' toe
    // createdAt is perfect als timestamp voor je grafiek
}, {
    tableName: 'measurements',
    timestamps: true 
});

module.exports = Measurement;