const assignmentService = require('../services/assignment-service');

const getAllAssignments = async (req, res, next) => {
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
        req.body.user_id = req.user;
        // Additional validation for assignment points
        const points = req.body.points;
        if (points < 1 || points > 10) {
            return res.status(400).json({ error: 'Assignment points must be between 1 and 10.' });
        }
        const assignment = await assignmentService.createAssignment(req.body);
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateAssignment = async (req, res) => {
    try {
        const assignmentId = req.params['id'];
        const userId = req.user;
        
        // Check if the user who created the assignment is updating it
        const assignment = await assignmentService.getAssignment(assignmentId);
        if (!assignment || assignment.user_id !== userId) {
            return res.status(403).json({ error: 'You do not have permission to update this assignment.' });
        }
        // Users should not be able to set values for assignment_created and assignment_updated
        delete req.body.assignment_created;
        delete req.body.assignment_updated;
        
        console.log('-herer assignmentId---------, ',assignmentId, userId)
        const updatedAssignment = await assignmentService.updateAssignment(assignmentId, req.body);
        res.status(200).json(updatedAssignment);
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteAssignment = async (req, res) => {
    try {
        const assignmentId = req.params.id;
        const userId = req.user;

        // Check if the user who created the assignment is deleting it
        const assignment = await assignmentService.getAssignment(assignmentId);
        if (!assignment || assignment.user_id !== userId) {
            return res.status(403).json({ error: 'You do not have permission to delete this assignment.' });
        }

        const deletedAssignment = await assignmentService.deleteAssignment(assignmentId);
        res.status(200).json(deletedAssignment);
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
