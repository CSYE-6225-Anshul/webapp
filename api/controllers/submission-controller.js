const assignmentService = require('../services/assignment-service');
const submissionService = require('../services/submission-service.js');
const accountService = require('../services/account-service.js');
const StatsD = require('node-statsd');
const statsd = new StatsD({host: process.env.METRICS_HOSTNAME, port: process.env.METRICS_PORT});
const logger = require('../../logger.js');
const AWS = require('aws-sdk');

// Setting AWS credentials and region
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
});

// Create an SNS object
const sns = new AWS.SNS();

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
       
        if(assignment) {
            let prevSubmissions = await submissionService.getSubmissionCount(assignmentId, accountId);
        
            if(!prevSubmissions) prevSubmissions = 0;
            if(assignment.num_of_attempts <= prevSubmissions) {
                return res.status(403).json({ error: 'You have exceeded the number of attempts for this assignment.' });
            }
            if(assignment.deadline < Date.now()) {
                return res.status(403).json({ error: 'The due date for this assignment has passed.' });
            }
            
            // get account from accoutnService 
            const account = await accountService.getAccount(accountId);
            const topicArn = process.env.SNS_TOPIC;
          
            // Message to be sent to the SNS topic
            const message = {
                email: account.email,
                url: submission_url,
                assignmentId: assignmentId,
                accountId: accountId,
            };
            
            // Publish the message to the SNS topic
            const params = {
                Message: JSON.stringify(message),
                TopicArn: topicArn,
            }
            
            try {
                const publishResult = await sns.publish(params).promise();
                logger.info('----------res of ses---------', publishResult);
                // Check if the message was successfully published to the SNS topic
                if (publishResult.MessageId) {
                    // Create submission
                    const submission = await submissionService.createSubmission({ submission_url, assignment_id: assignmentId, account_id: accountId });
                    if (submission) {
                        return res.status(201).json(submission);
                    }
                } else {
                    logger.info('Error publishing to SNS:', publishResult);
                    return res.status(503).json({ error: 'Failed to publish message to SNS' });
                }
            } catch (error) {
                logger.info('Error publishing to SNS:', error);
                return res.status(503).json({ error: 'Failed to publish message to SNS' });
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
        logger.info('An error occurred:', error);
        return res.status(503).json();
    }
}

module.exports = {
    createSubmission
}
