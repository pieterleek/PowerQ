const MeasurementService = require('../services/measurement.service');

class MeasurementController {
    async createMeasurement(req, res) {
        try {
            const { current, voltage } = req.body;

            if (current === undefined) {
                return res.status(400).json({ message: 'Missing current value' });
            }

            const result = await MeasurementService.processNewData({ current, voltage });

            // Stuur snel antwoord terug zodat de ESP32 niet wacht
            return res.status(201).json({ success: true, data: result });
        } catch (error) {
            console.error('Error in controller:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = new MeasurementController();