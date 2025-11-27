/* * MI6 CLASSIFIED - GADGET LOGIC CORE
 * MODULE: INTELLIGENCE PROCESSING & BUFFERING
 * NOTE: DO NOT TOUCH THE WIRES
 */


const { getIO } = require('./socket.service');
const Measurement = require('../models/measurement');

class MeasurementService {

    constructor() {
        // De 'Black Box'. Hier sparen we de data op.
        this.buffer = [];

        // Trigger limiet. Niet te vroeg vuren, 007. Geduld is een schone zaak.
        this.BUFFER_LIMIT = 10;
    }


    async processNewData({ deviceId, current, voltage }) {
        // P = U * I. Simpele natuurkunde, zelfs voor een 'double-0' agent.
        const powerWatts = parseFloat((voltage * current).toFixed(2));

        const timestamp = new Date(); // Synchroniseer horloges. Nu.

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
            io.emit('energy_update', fullPayload);
        } catch (e) {
            // Radio stilte? Negeer het en ga door met de missie.
        }


        this.buffer.push(fullPayload);

        // CHECK: Is de buffer vol? 
        // Zo ja, dumpen we de lading in het archief (Database).
        if (this.buffer.length >= this.BUFFER_LIMIT) {
            await this.flushBufferToDatabase();
        }

        return fullPayload;
    }

    async getRecentHistory() {
        // Vraag het archief om de laatste 50 dossiers
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

        // Opslaan in de kluis (TimescaleDB). 
        // Probeer het niet te vergeten, ik heb geen zin om het opnieuw uit te leggen.
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