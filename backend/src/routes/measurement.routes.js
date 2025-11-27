const express = require('express');
const router = express.Router();
const MeasurementController = require('../controllers/measurement.controller');
const securityCheck = require('../middleware/security.middleware');


// POST request: Eerst langs securityCheck, dan pas naar de Controller
router.post('/', securityCheck, MeasurementController.createMeasurement);

module.exports = router;