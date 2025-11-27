/* * MI6 CLASSIFIED
 * MODULE: CONTROLLER
 */

const MeasurementService = require('../services/measurement.service');

class MeasurementController {
    
    // 1. POST: Nieuwe data ontvangen (van ESP32)
    async createMeasurement(req, res) {
        try {
            const { deviceId, current, voltage } = req.body;

            // Security check: is de payload compleet?
            if (!deviceId || current === undefined) {
                console.warn(`⚠️ ALERT: Suspicious intel received.`, req.body);
                return res.status(400).json({ 
                    message: 'Negative. Missing credentials or payload.' 
                });
            }

            const result = await MeasurementService.processNewData({ 
                deviceId, 
                current, 
                voltage: voltage || 230.0 
            });

            return res.status(201).json({ success: true, data: result });

        } catch (error) {
            console.error('CRITICAL FAILURE in Comm-Link:', error);
            return res.status(500).json({ message: 'System Malfunction.' });
        }
    }

    // 2. GET: Historie ophalen (HIERGING HET WAARSCHIJNLIJK MIS)
    // Zorg dat deze functie BINNEN de class staat!
    async getHistory(req, res) {
        try {
            // Roep de service aan
            const history = await MeasurementService.getRecentHistory();
            
            // Stuur data terug naar de frontend
            return res.status(200).json(history);
        } catch (error) {
            console.error('Retrieval Error:', error);
            return res.status(500).json({ message: 'Kan archief niet openen.' });
        }
    }
}

// Export de instantie van de class
module.exports = new MeasurementController();