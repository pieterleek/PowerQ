const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Measurement = sequelize.define('Measurement', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    // De koppeling met de specifieke ESP32
    deviceId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
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
    
    // Power slaan we op zodat we niet telkens hoeven te rekenen bij het uitlezen
    power: {
        type: DataTypes.FLOAT, 
        allowNull: false
    },
    // Expliciete timestamp voor TimescaleDB
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'measurements',
    timestamps: false, // We beheren 'timestamp' zelf, dus geen standaard createdAt/updatedAt
    indexes: [
        // Index 1: Cruciaal voor TimescaleDB (tijdreeksen)
        {
            fields: ['timestamp']
        },
        // Index 2: Zorgt dat je snel kunt filteren op specifiek apparaat (bijv. "METER_01")
        {
            fields: ['deviceId']
        },
        // Index 3: Combi-index (vaak gebruikt: "Geef data van METER_01 van vandaag")
        {
            fields: ['deviceId', 'timestamp']
        }
    ]
});

module.exports = Measurement;