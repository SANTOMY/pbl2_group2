const express = require('express');
const router = express.Router();
const SpotController = require('./spotController');
const spotController = new SpotController();

router.post("/saveSpot",spotController.register);
router.get("/search",spotController.search);

module.exports = router;