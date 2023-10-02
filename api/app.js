const express = require('express');
const cors = require('cors');
const db = require('./models/index');
const routes = require('./routes/index');
const dotenv = require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Cache-Control', 'no-cache');
    next();
});

// passing app in routes
routes(app);

module.exports = app;