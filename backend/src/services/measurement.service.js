/* * MI6 CLASSIFIED - GADGET LOGIC CORE
 * MODULE: INTELLIGENCE PROCESSING & BUFFERING
 * NOTE: DO NOT TOUCH THE WIRES
 */


const { getIO } = require('./socket.service');
const Measurement = require('../models/measurement');

class MeasurementService {

    constructor() {
         this.buffer = [];
         this.BUFFER_LIMIT = 10;
    }


   async processNewData({ deviceId, current, voltage = 230 }) {
        // CALCULATING...
        const powerWatts = parseFloat((voltage * current).toFixed(2));
        const timestamp = new Date();


        if (!deviceId || typeof current !== 'number' || isNaN(current)) {
            throw new Error('Ongeldige meetgegevens ontvangen.' + JSON.stringify({ deviceId, current, voltage })    );
        }

        const payload = {
            deviceId: deviceId,  
            current: parseFloat(current),
            voltage: parseFloat(voltage),
            power: powerWatts,
            timestamp: timestamp
        };

        // LIVE FEED
        try {
            const io = getIO();
            io.emit('energy_update', payload); 
        } catch (e) {
            // Radio stilte
        }

        // BUFFER UPDATE
        this.buffer.push(payload); // Nu zit deviceId ook in de buffer

        // CHECK LIMIT
        if (this.buffer.length >= this.BUFFER_LIMIT) {
            await this.flushBufferToDatabase();
        }

        return payload;
    }

    async getRecentHistory() {
           return await Measurement.findAll({
            limit: 50,
            order: [['timestamp', 'DESC']] // Nieuwste eerst
        });
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

    
        Measurement.create(dbPayload)
            .catch(err => console.error('Fout bij opslaan geaggregeerde data:', err));

    }

    //wiskundig gemiddelde. Hogere Q logica
    calculateAverage(arr) {
        const sum = arr.reduce((a, b) => a + b, 0);
        return parseFloat((sum / arr.length).toFixed(2));
    }
}

//  singleton export.
module.exports = new MeasurementService();