const MeasurementService = require('../services/measurement.service');

class MeasurementController {


    // TO DO : Add security checks (API Key, Auth, etc.)

    async createMeasurement(req, res) {
        try {
            const { deviceId, current, voltage } = req.body;

            // Voltage mag optioneel zijn (default 230), maar current en ID zijn verplicht.
            if (!deviceId || current === undefined) {
                console.warn(`Ongeldige data ontvangen:`, req.body);
                return res.status(400).json({ 
                    message: 'Invalid payload. Required: deviceId, current' 
                });
            }

          
            const result = await MeasurementService.processNewData({ 
                deviceId, 
                current, 
                voltage: voltage || 230.0 // Fallback als ESP32 geen voltage stuurt
            });

            return res.status(201).json({ success: true, data: result });
        } catch (error) {
            console.error('Controller Error:', error);
            return res.status(500).json({ message: 'Server Error' });
        }
    }
}

module.exports = new MeasurementController();