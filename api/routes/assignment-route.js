const express = require('express');
const assignmentController = require('../controllers/assignment-controller');
const Router = express.Router();

Router
    .route('/')
    .get(assignmentController.getAllAssignments)
    .post(assignmentController.createAssignment);

Router
    .route('/:id')
    .get(assignmentController.getAssignment)
    .put(assignmentController.updateAssignment)
    .delete(assignmentController.deleteAssignment);

module.exports = Router;
