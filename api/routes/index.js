const healthzRouter = require('./healthz-route.js');
const assignmentRouter = require('./assignment-route.js');
const authMiddleware = require('../controllers/authenticate-controller');

const route = (app) => {
    app.use('/healthz', healthzRouter);
    // app.use('/v1/assignments', authMiddleware, assignmentRouter);
    app.use('/v2/assignments', authMiddleware, assignmentRouter);

    app.use('*', (req, res) => {
        res.status(404).json();
    });
}

module.exports = route;
