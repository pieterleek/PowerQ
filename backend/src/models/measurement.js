// Model voor databanktabel 'measurements'
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Measurement = sequelize.define('Measurement', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true 
    },
    deviceId: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: false
        }
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
        type: DataTypes.FLOAT, 
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        primaryKey: true 
    }
}, {
    tableName: 'measurements',
    timestamps: false, 
    indexes: [
        { fields: ['timestamp'] }
    ]
});

module.exports = Measurement;