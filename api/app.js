const express = require('express');
const cors = require('cors');
const db = require('./models/index');
const routes = require('./routes/index');
const dotenv = require('dotenv').config();
const app = express();
const readCSV = require('./controllers/readCSV');
const logger = require('../logger');
const metricController = require('./controllers/metric-controller');

app.use(cors());
app.use(express.json());
// app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

const checkConnection = async (req, res, next) => {
    try {
        await db.sequelize.authenticate();
        console.log('Connection is established.');
        next();
    } catch (error) {
        console.error('Unable to connect to the database.');
        return res.status(503).json();
    }
}
app.use(checkConnection);

// Middleware for instrumenting APIs
const apiInstrumentation = (req, res, next) => {
    const apiEndpoint = req.originalUrl.startsWith('/v1')
    ? req.originalUrl.split('/v1')[1]
    : req.originalUrl;

    const statsd = metricController(apiEndpoint, req.method);
    console.log('statsd', statsd);
    next();
}

// Apply the middleware to all routes
app.use(apiInstrumentation);

const syncDatabase = async () => {
    try {
        // Synchronize the database
        await db.sequelize.sync();
        console.log('Database synchronized successfully');
        logger.warn('Database synchronized successfully');
        // Now that the database is synchronized, read the CSV
        await readCSV();
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
};

// Use syncDatabase before setting up routes
syncDatabase();

app.use((req, res, next) => {
    res.header('Cache-Control', 'no-cache');
    next();
});

// passing app in routes
routes(app);

module.exports = app;