const express = require('express');
const travelRoutes = express.Router();
const { postTravel, getAllTravel } = require('../controllers/TravelController');

travelRoutes.get('/travel/all', getAllTravel);
travelRoutes.post('/travel/new', postTravel);

module.exports = travelRoutes;