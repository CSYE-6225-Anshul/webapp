const express = require('express');
const Router = express.Router();
const assignmentController = require('../controllers/assignment-controller.js');

Router.route('/')
    .get(assignmentController.getAllAssignments)
    .post(assignmentController.createAssignment);

Router.route('/:id')
    .get(assignmentController.getAssignment)
    .put(assignmentController.updateAssignment)
    .delete(assignmentController.deleteAssignment);

module.exports = Router;
