const assignmentService = require('../services/assignment-service');
const submissionService = require('../services/submission-service.js');
const StatsD = require('node-statsd');
const statsd = new StatsD({host: process.env.METRICS_HOSTNAME, port: process.env.METRICS_PORT});
const logger = require('../../logger.js');
const e = require('express');

// Payload error response fn
const setPayloadErrResponse = (res) => {
    res.status(400).json();
}

const createSubmission = async (req, res, next) => {
    try {
        let stats = statsd.increment('createSubmission', 1);
        logger.info(`Method: ${req.method} - Endpoint: ${req.baseUrl} - Client IP: ${req.connection.remoteAddress}`);

        const assignmentId = req.params.id;
        const { submission_url } = req.body;

        // Check if required fields are provided
        if (!assignmentId || !submission_url) {
            return res.status(400).json({ error: 'Bad Request' });
        }
        
        const accountId = req.user;
        let assignment = await assignmentService.getAssignment(req.params.id, accountId);
        
        if(assignment && assignment.accAssignment && assignment.accAssignment.accountId !== accountId) {
            return res.status(403).json({ error: 'You do not have permission to view this assignment.' });
        }
        if(assignment) {
            let prevSubmissions = await submissionService.getSubmissionCount(assignmentId);
        
            if(!prevSubmissions) prevSubmissions = 0;
            if(assignment.num_of_attempts <= prevSubmissions) {
                return res.status(403).json({ error: 'You have exceeded the number of attempts for this assignment.' });
            }
            if(assignment.deadline < Date.now()) {
                return res.status(403).json({ error: 'The due date for this assignment has passed.' });
            }
            
            // Create submission
            const submission = await submissionService.createSubmission({ submission_url, assignment_id: assignmentId });
            if (submission) {
                return res.status(201).json(submission);
            }
        } else {
            return res.status(404).json();
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        } else if (error.name === 'PermissionError') {
            return res.status(403).json({ error: 'Permission denied' });
        }
        console.error('An error occurred:', error);
        return res.status(503).json();
    }
}

module.exports = {
    createSubmission
}
