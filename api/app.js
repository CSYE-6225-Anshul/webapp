const express = require('express');
const cors = require('cors');
const db = require('./models/index');
const routes = require('./routes/index');
const dotenv = require('dotenv').config();
const app = express();
const readCSV = require('./controllers/readCSV');
const logger = require('../logger');

app.use(cors());
app.use(express.json());
// app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

const checkConnection = async (req, res, next) => {
    try {
        await db.sequelize.authenticate();
        logger.info(`Connection is established.`);
        next();
    } catch (error) {
        logger.error(`Unable to connect to the database.`);
        return res.status(503).json();
    }
}
app.use(checkConnection);

const syncDatabase = async () => {
    try {
        // Synchronize the database
        await db.sequelize.sync();
        logger.info('Database synchronized successfully');
        // Now that the database is synchronized, read the CSV
        await readCSV();
    } catch (error) {
        logger.error(`Error synchronizing database: ${error}`);
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