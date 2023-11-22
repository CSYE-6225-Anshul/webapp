const express = require('express');
const Router = express.Router();
const assignmentController = require('../controllers/assignment-controller.js');
const submissionController = require('../controllers/submission-controller.js');

Router.route('/')
    .get(assignmentController.getAllAssignments)
    .post(assignmentController.createAssignment);

Router.route('/:id')
    .get(assignmentController.getAssignment)
    .put(assignmentController.updateAssignment)
    .delete(assignmentController.deleteAssignment);

Router.route('/:id/submission')
    .post(submissionController.createSubmission);

// Middleware to send an error response for non-GET requests
Router.use((req, res, next) => {
    if (req.method == 'PATCH') {
      // Send an error response for non-GET requests
      return res.status(405).json();
    }
    next(); // Continue processing for GET requests
});

module.exports = Router;
