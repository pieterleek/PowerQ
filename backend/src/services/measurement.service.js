// src/services/measurement.service.js
const { getIO } = require('./socket.service');
const Measurement = require('../models/measurement');

class MeasurementService {

    constructor() {
        this.buffer = [];
        this.BUFFER_LIMIT = 10;
    }


    async processNewData({ deviceId, current, voltage }) {
        // A. Verrijking (Calculated Fields)
        const powerWatts = parseFloat((voltage * current).toFixed(2));
        const timestamp = new Date(); // Server tijd is leidend (Single Source of Truth)

        const fullPayload = {
            deviceId,   // Komt van ESP
            current,    // Komt van ESP
            voltage,    // Komt van ESP
            power: powerWatts,    // Berekend door Server
            timestamp: timestamp  // Berekend door Server
        };

        // 2. STUUR DIRECT NAAR SOCKET (Live view blijft 0.5s)
        // De gebruiker ziet de meter wild bewegen, precies zoals het hoort.
        try {
            const io = getIO();
            io.emit('energy_update', realTimePayload);
        } catch (e) {
            // Socket errors mogen de flow niet breken
        }

        // 3. BUFFEREN VOOR DATABASE
        // We voegen de meting toe aan de wachtrij
        this.buffer.push(realTimePayload);

        // 4. CHECK: Is de buffer vol?
        if (this.buffer.length >= this.BUFFER_LIMIT) {
            await this.flushBufferToDatabase();
        }

        return realTimePayload;
    }

    // Hulpfunctie om het gemiddelde te berekenen en op te slaan
    async flushBufferToDatabase() {
        const dataToProcess = [...this.buffer];
        this.buffer = [];

        // Bereken gemiddelden
        const avgCurrent = this.calculateAverage(dataToProcess.map(m => m.current));
        const avgVoltage = this.calculateAverage(dataToProcess.map(m => m.voltage));
        const avgPower = this.calculateAverage(dataToProcess.map(m => m.power));

        // We gebruiken de timestamp van het LAATSTE item in de batch als opslagtijd
        const lastTimestamp = dataToProcess[dataToProcess.length - 1].timestamp;

        const dbPayload = {
            current: avgCurrent,
            voltage: avgVoltage,
            power: avgPower,
            timestamp: lastTimestamp
        };

        // Opslaan in TimescaleDB (asynchroon, we wachten er niet op)
        Measurement.create(dbPayload)
            .catch(err => console.error('Fout bij opslaan geaggregeerde data:', err));

    }

    //wiskundig gemiddelde
    calculateAverage(arr) {
        const sum = arr.reduce((a, b) => a + b, 0);
        return parseFloat((sum / arr.length).toFixed(2));
    }
}

//  singleton export.
module.exports = new MeasurementService();