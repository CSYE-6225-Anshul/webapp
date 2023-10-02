const healthzRouter = require('./healthz-route.js');

const route = (app) => {
    app.use('/healthz', healthzRouter);
    app.use('*', (req, res) => {
        res.status(404).json();
    });
}

module.exports = route;