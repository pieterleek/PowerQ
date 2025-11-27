const express = require('express');
const router = express.Router();
const MeasurementController = require('../controllers/measurement.controller');
const securityCheck = require('../middleware/security.middleware');
const securityCheckFE = require('../middleware/security.middleware.frontend');



// Beide routes nu beveiligd met dezelfde sleutel
router.post('/', securityCheckFE, MeasurementController.createMeasurement);
router.get('/', securityCheckFE, MeasurementController.getHistory); // <- Slot erop!

module.exports = router;