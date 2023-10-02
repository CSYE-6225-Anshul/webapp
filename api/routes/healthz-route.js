import express from "express";
import * as healthzController from '../controllers/healthz-controller.js';

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

export default Router;
