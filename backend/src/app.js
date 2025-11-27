// src/app.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// Imports voor Database & Architectuur
const sequelize = require('./config/database');
const Measurement = require('./models/measurement'); // Nodig om het model te laden
const initializeTimescale = require('./utils/timescale-init');
const measurementRoutes = require('./routes/measurement.routes');
const { setupSocket } = require('./services/socket.service');

// Setup Express & HTTP Server
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io Setup
const io = new Server(server, {
    cors: { origin: "*" }
});
setupSocket(io);

// Routes koppelen
app.use('/api/measurements', measurementRoutes);

const PORT = process.env.PORT || 3000;

// --- DE BELANGRIJKSTE WIJZIGING ---
// We gebruiken één centrale functie om alles in de juiste volgorde te starten.
// Er staan GEEN losse server.listen() commando's meer buiten deze functie.

async function startServer() {
    try {
        console.log(' Verbinding maken met database...');
        
        // 1. Database syncen (tabellen aanmaken)
        await sequelize.sync(); 
        console.log('✅ Database gesynchroniseerd.');

        // 2. TimescaleDB initialiseren (Hypertable maken)
        await initializeTimescale();
        
        // 3. Pas als alles klaar is, starten we de poort (luisteren)
        server.listen(PORT, () => {
            console.log(`PowerQ Backend draait op poort ${PORT}`);
        });

    } catch (error) {
        console.error('Kan server niet starten:', error);
    }
}

// Start de kettingreactie
startServer();