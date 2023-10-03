const assignmentService = require('../services/assignment-service');

const getAllAssignments = async (req, res) => {
    try {
        const assignments = await assignmentService.getAllAssignments();
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getAssignment = async (req, res) => {
    try {
        const assignment = await assignmentService.getAssignment(req.params.id);
        res.status(200).json(assignment);
    } catch (error) {
        res.status(500).json(error);
    }
}

const createAssignment = async (req, res) => {
    try {
        const assignment = await assignmentService.createAssignment(req.body);
        res.status(200).json(assignment);
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateAssignment = async (req, res) => {
    try {
        const assignment = await assignmentService.updateAssignment(req.params.id, req.body);
        res.status(200).json(assignment);
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteAssignment = async (req, res) => {
    try {
        const assignment = await assignmentService.deleteAssignment(req.params.id);
        res.status(200).json(assignment);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    getAllAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment
}
