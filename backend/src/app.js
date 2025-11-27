const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

require('dotenv').config();

const measurementRoutes = require('./routes/measurement.routes');
const { setupSocket } = require('./services/socket.service');
const sequelize = require('./config/database');
const Measurement = require('./models/measurement');

const app = express();
const server = http.createServer(app);

// Clean Code: Middleware configuratie apart houden
app.use(cors());
app.use(express.json());

sequelize.sync() // .sync({ force: true }) wist de tabel elke keer (pas op!)
    .then(() => {
        console.log('PostgreSQL database verbonden en gesynchroniseerd.');
        server.listen(PORT, () => {
            console.log(`Energy Monitor Backend draait op poort ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Kan geen verbinding maken met database:', err);
    });

// Initialiseer Socket.io (voor de frontend push)
const io = new Server(server, {
    cors: { origin: "*" } 
});

setupSocket(io);

// Routes
app.use('/api/measurements', measurementRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`PowerQ Backend draait op poort ${PORT}`);
});