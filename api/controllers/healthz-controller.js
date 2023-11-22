const db = require('../models/index.js');
const logger = require('../../logger.js');
const StatsD = require('node-statsd');
const statsd = new StatsD({host: process.env.METRICS_HOSTNAME, port: process.env.METRICS_PORT});

const get = async (req, res, next) => {
    try {
        let stats = statsd.increment('healthz', 1);
        console.log('stats', stats);
        logger.info(`Method: ${req.method} - Endpoint: ${req.baseUrl} - Client IP: ${req.connection.remoteAddress}`);
        let payloadCondition = false;
        if (req.query != null && Object.keys(req.query).length > 0) payloadCondition = true;
        if (req.body != null && Object.keys(req.body).length > 0) payloadCondition = true;
        if (payloadCondition) {
            // If the payload meets the error condition
            return setPayloadErrResponse(res);
        }
        await checkConnection(res, next);
        return setSuccessfulResponse(res);
    }
    catch (err) {
        return setErrorResponse(err, res);
    }
}

// success response fn to send response
const setSuccessfulResponse = (res) => {
    res.status(200).json();
}

// Payload error response fn
const setPayloadErrResponse = (res) => {
    res.status(400).json();
}

// error response fn to send error
const setErrorResponse = (err, res, statusCode) => {
    if (!statusCode) res.status(503);
    else res.status(statusCode);
    res.json();
}

const checkConnection = async (res, next) => {
    try {
        await db.sequelize.authenticate();
        logger.info(`Connection is established.`);
        await db.sequelize.sync({ force: false }); // Set 'force' to true to force synchronization
        next();
    } catch (error) {
        logger.error(`Unable to connect to the database.`);
        res.status(503).json();
    }
}

module.exports = {
    get
}
