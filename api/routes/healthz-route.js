const express = require('express');
const healthzController = require('../controllers/healthz-controller.js');
const Router = express.Router();

Router.route("/")
    .get(healthzController.get)

// Middleware to send an error response for non-GET requests
Router.use((req, res, next) => {
    if (req.method !== 'GET') {
      // Send an error response for non-GET requests
      return res.status(405).json();
    }
    next(); // Continue processing for GET requests
});

module.exports = Router;
