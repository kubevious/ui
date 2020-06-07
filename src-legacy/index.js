const logger = require('./logger');
logger.info("init");

const Context = require('./lib/context');
var context = new Context(logger);


if (process.env.NODE_ENV === "development") {
}

context.run();