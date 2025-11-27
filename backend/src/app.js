/* * MI6 OPERATION CENTER
 * FILE: app.js
 * STATUS: ACTIVE
 * CLEARANCE: TOP SECRET
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const path = require('path');



// --- ASSETS & INTELLIGENCE ---
const sequelize = require('./config/database');
const Measurement = require('./models/measurement'); // Cruciaal: Laad het model in het geheugen
const initializeTimescale = require('./utils/timescale-init');
const measurementRoutes = require('./routes/measurement.routes');
const { setupSocket } = require('./services/socket.service');

// --- INITIALIZING SYSTEMS ---
const app = express();
const server = http.createServer(app);

// --- PROTOCOLS (Middleware) ---
app.use(cors()); // Sta communicatie toe van andere locaties (Front-end)
app.use(express.json()); // Sta JSON payloads toe


app.use(express.static(path.join(__dirname, '../public')));


const io = new Server(server, {
    cors: { origin: "*" }
});

setupSocket(io);


app.use('/api/measurements', measurementRoutes);

const PORT = process.env.PORT || 3000;


async function startMission() {
    try {
        console.log('System initializing...');
        console.log('Connecting to Mainframe (Database)...');
      
        await sequelize.sync(); 
        console.log('Mainframe connected & synchronized.');


        await initializeTimescale();
        
   
        server.listen(PORT, () => {
            console.log(`Operation "Q-power" is LIVE on port ${PORT}`);
            console.log(`Secure Comm-Link established.`);
        });

    } catch (error) {
        console.error('MISSION CRASHED: Critical system failure during startup.');
        console.error(error);
    }
}

// Execute.
startMission();