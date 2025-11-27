const express = require('express');
const router = express.Router();
const MeasurementController = require('../controllers/measurement.controller');
const securityCheck = require('../middleware/security.middleware');



// Beide routes nu beveiligd met dezelfde sleutel
router.post('/', securityCheck, MeasurementController.createMeasurement);
router.get('/', securityCheck, MeasurementController.getHistory); // <- Slot erop!

module.exports = router;