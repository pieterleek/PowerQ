/* * MI6 CLASSIFIED - LEVEL 5 CLEARANCE
 * MODULE: INCOMING INTEL INTERCEPTOR
 * CODENAME: "THE GATEKEEPER"
 */


const MeasurementService = require('../services/measurement.service');
class MeasurementController {


    // TO DO : Add security checks (API Key, Auth, etc.)

    async createMeasurement(req, res) {
        try {
            const { deviceId, current, voltage } = req.body;

            // Voltage mag optioneel zijn (default 230), maar current en ID zijn verplicht.
            if (!deviceId || current === undefined) {
                console.warn(`ALERT: Suspicious intel received from unknown agent : `, req.body);
                return res.status(400).json({ 
                    message: 'Negative, 007. Missing credentials or payload.' 
                });
            }

            // Delegeer naar "The Quartermaster" (Service Layer) voor verwerking.
            const result = await MeasurementService.processNewData({ 
                deviceId, 
                current, 
                voltage: voltage || 230.0 // Fallback als ESP32 geen voltage stuurt - Standaard Europese spanning.
            });

            // Mission Accomplished. Bevestig ontvangst aan de zender.
            return res.status(201).json({ success: true, data: result });
        } catch (error) {
            console.error('Controller Error:', error);
            return res.status(500).json({ message: 'System Malfunction. Call Q' });
        }
    }
}

module.exports = new MeasurementController();