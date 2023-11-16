const assignmentService = require('../services/assignment-service');
const db = require('../models/index.js');
const { NUMBER } = require('sequelize');
const StatsD = require('node-statsd');
const statsd = new StatsD({host: process.env.METRICS_HOSTNAME, port: process.env.METRICS_PORT});
const logger = require('../../logger.js');

// Payload error response fn
const setPayloadErrResponse = (res) => {
    res.status(400).json();
}

const getAllAssignments = async (req, res, next) => {
    try {
        let stats = statsd.increment('getAllAssignments', 1);
        console.log('stats', stats);
        logger.info(`Method: ${req.method} - Endpoint: ${req.baseUrl} - Client IP: ${req.connection.remoteAddress}`);
        let payloadCondition = false;
        if (req.query != null && Object.keys(req.query).length > 0) payloadCondition = true;
        if (req.body != null && Object.keys(req.body).length > 0) payloadCondition = true;
        if (payloadCondition) {
            // If the payload meets the error condition
            return setPayloadErrResponse(res);
        }

        let accountId = req.user;
        const assignments = await assignmentService.getAllAssignments(accountId);
        res.status(200).json(assignments);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        } else if (error.name === 'PermissionError') {
            return res.status(403).json({ error: 'Permission denied' });
        }
        console.error('An error occurred:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAssignment = async (req, res, next) => {
    try {
        let stats = statsd.increment('getAssignment', 1);
        console.log('stats', stats);
        logger.info(`Method: ${req.method} - Endpoint: ${req.originalUrl} - Client IP: ${req.connection.remoteAddress}`);
        let payloadCondition = false;
        if (req.body != null && Object.keys(req.body).length > 0) payloadCondition = true;
        if (payloadCondition) {
            // If the payload meets the error condition
            return setPayloadErrResponse(res);
        }
        
        const accountId = req.user;
        const assignment = await assignmentService.getAssignment(req.params.id, accountId);

        if(assignment && assignment.accAssignment && assignment.accAssignment.accountId !== accountId) {
            return res.status(403).json({ error: 'You do not have permission to view this assignment.' });
        }
        if(assignment) {
            res.status(200).json(assignment);
        }
        else {
            res.status(404).json();    
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        } else if (error.name === 'PermissionError') {
            return res.status(403).json({ error: 'Permission denied' });
        }
        console.error('An error occurred:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const createAssignment = async (req, res, next) => {
    try {
        let stats = statsd.increment('createAssignment', 1);
        console.log('stats', stats);
        logger.info(`Method: ${req.method} - Endpoint: ${req.baseUrl} - Client IP: ${req.connection.remoteAddress}`);
        let payloadCondition = false;
        if (req.query != null && Object.keys(req.query).length > 0) payloadCondition = true;
        if (payloadCondition) {
            // If the payload meets the error condition
            return setPayloadErrResponse(res);
        }

        if (!req.body || req.body == null || Object.keys(req.body).length <= 0) {
            return res.status(400).json({ error: 'All fields should be defined.' });
        }

        if(Object.keys(req.body).length > 4) {
            return res.status(400).json({ error: 'Extra fields not allowed.' });
        }

        console.log('------req.body', req.body, Object.keys(req.body).length)

        if (!req.body || req.body == null || Object.keys(req.body).length <= 0) {
            return res.status(400).json({ error: 'All fields should be defined.' });
        }

        req.body.user_id = req.user;
        // Additional validation for assignment points
        let {name, points, num_of_attempts, deadline} = req.body;
        if(name == undefined || points == undefined || num_of_attempts == undefined || deadline == undefined) {
            return res.status(400).json({ error: 'All fields should be present.' });
        }
        if(name.length <= 0 || deadline.length <= 0) {
            return res.status(400).json({ error: 'All fields should be defined.' });
        }
        if (points < 1 || points > 100 || num_of_attempts < 1 || num_of_attempts > 100) {
            return res.status(400).json({ error: 'Assignment points & num_of_attempts must be between 1 and 100.' });
        }
        console.log('-------------', typeof name, typeof deadline)
        if(typeof name != 'string' || typeof points != 'number' || typeof num_of_attempts != 'number' || typeof deadline != 'string') {
            return res.status(400).json({ error: 'Field datatype mismatch.' });
        }
        const assignment = await assignmentService.createAssignment(req.body);
        res.status(201).json(assignment);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        } else if (error.name === 'PermissionError') {
            return res.status(403).json({ error: 'Permission denied' });
        }
        console.error('An error occurred:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateAssignment = async (req, res, next) => {
    try {
        let stats = statsd.increment('updateAssignment', 1);
        console.log('stats', stats);
        logger.info(`Method: ${req.method} - Endpoint: ${req.originalUrl} - Client IP: ${req.connection.remoteAddress}`);
        if (!req.body || req.body == null || Object.keys(req.body).length <= 0) {
            return res.status(400).json({ error: 'All fields should be defined.' });
        }

        if(Object.keys(req.body).length > 4) {
            return res.status(400).json({ error: 'Extra fields not allowed.' });
        }
        
        const assignmentId = req.params['id'];
        const userId = req.user;
        let {name, points, num_of_attempts, deadline} = req.body;
        if(name == undefined || points == undefined || num_of_attempts == undefined || deadline == undefined) {
            return res.status(400).json({ error: 'All fields should be present.' });
        }
        if(name.length <= 0 || deadline.length <= 0) {
            return res.status(400).json({ error: 'All fields should be defined.' });
        }
        if (points < 1 || points > 100 || num_of_attempts < 1 || num_of_attempts > 100) {
            return res.status(400).json({ error: 'Assignment points & num_of_attempts must be between 1 and 100.' });
        }
        console.log('-------------', typeof name, typeof deadline)
        if(typeof name != 'string' || typeof points != 'number' || typeof num_of_attempts != 'number' || typeof deadline != 'string') {
            return res.status(400).json({ error: 'Field datatype mismatch.' });
        }
        // Check if the user who created the assignment is updating it
        const assignment = await assignmentService.getAssignment(assignmentId);
        if (!assignment ||  assignment.accAssignment.accountId !== userId) {
            return res.status(403).json({ error: 'You do not have permission to update this assignment.' });
        }
        // Users should not be able to set values for assignment_created and assignment_updated
        delete req.body.assignment_created;
        delete req.body.assignment_updated;
        
        const updatedAssignment = await assignmentService.updateAssignment(assignmentId, req.body);
        res.status(204).json();
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        } else if (error.name === 'PermissionError') {
            return res.status(403).json({ error: 'Permission denied' });
        }
        console.error('An error occurred:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteAssignment = async (req, res, next) => {
    try {
        let stats = statsd.increment('deleteAssignment', 1);
        console.log('stats', stats);
        logger.info(`Method: ${req.method} - Endpoint: ${req.originalUrl} - Client IP: ${req.connection.remoteAddress}`);
        let payloadCondition = false;
        if (req.body != null && Object.keys(req.body).length > 0) payloadCondition = true;
        if (payloadCondition) {
            // If the payload meets the error condition
            return setPayloadErrResponse(res);
        }

        const assignmentId = req.params.id;
        const userId = req.user;

        // Check if the user who created the assignment is deleting it
        const assignment = await assignmentService.getAssignment(assignmentId);
        if(!assignment) {
            return res.status(404).json();
        }

        if (!assignment || assignment.accAssignment.accountId !== userId) {
            return res.status(403).json({ error: 'You do not have permission to delete this assignment.' });
        }

        const deletedAssignment = await assignmentService.deleteAssignment(assignmentId);
        res.status(204).json();
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        } else if (error.name === 'PermissionError') {
            return res.status(403).json({ error: 'Permission denied' });
        }
        console.error('An error occurred:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAllAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment
}
