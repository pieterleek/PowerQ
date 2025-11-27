// src/utils/timescale-init.js
const sequelize = require('../config/database');

async function initializeTimescale() {
    try {
       
        await sequelize.query("CREATE EXTENSION IF NOT EXISTS timescaledb;");

        
        await sequelize.query(`
            SELECT create_hypertable(
                'measurements', 
                'timestamp', 
                if_not_exists => TRUE
            );
        `);
        

        await sequelize.query(`
            ALTER TABLE measurements SET (
                timescaledb.compress,
                timescaledb.compress_segmentby = 'id'
            );
        `);
        
        await sequelize.query(`
            SELECT add_compression_policy('measurements', INTERVAL '7 days');
        `);

        console.log("TimescaleDB Hypertable succesvol geconfigureerd.");
    } catch (error) {
        // Negeer errors als de tabel al een hypertable is
        if (!error.message.includes('already a hypertable')) {
            console.error("TimescaleDB init error:", error.message);
        }
    }
}

module.exports = initializeTimescale;