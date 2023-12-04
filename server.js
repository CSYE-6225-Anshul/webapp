const app = require("./api/app.js");
const logger = require('./logger.js');

const port = 8080;
app.listen(port, () => {
    logger.info(`Application listening on ${port}`);
});
