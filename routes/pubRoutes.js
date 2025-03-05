const express = require("express");
const router = express.Router();
const pubsController = require('../controllers/pubsController.js');

// Obtener todas las publicaciones
router.get('/', pubsController.getAllPublications);

module.exports = router; // Exporta el router
