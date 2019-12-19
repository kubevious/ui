const logger = require('the-logger').setup('appview-ui', {
    enableFile: false,
    cleanOnStart: false,
    pretty: true
});
logger.level = 'debug';


module.exports = logger;