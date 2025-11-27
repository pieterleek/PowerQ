const express = require('express');
const router = express.Router();
const MeasurementController = require('../controllers/measurement.controller');

// POST request die de ESP32 elke 0.5s aanroept
router.post('/', MeasurementController.createMeasurement);

module.exports = router;