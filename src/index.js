const logger = require('./logger');
logger.info("init");

const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();
const PromiseRouter = require('express-promise-router');

const port = 3000;

// view engine setup
app.engine('html', ejs.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

var reloadify = require('./lib/reloadify');
reloadify(app, __dirname + '/static');

app.use(express.static(__dirname + '/static'));

const BackendClient = require('./lib/backend-client');
var backendClient = new BackendClient(logger);

function loadRouter(name)
{
    logger.info("Loading router %s...", name);

    const router = PromiseRouter();

    var routerContext = {
        logger: logger.sublogger(name),
        backend: backendClient,
        router,
        app
    }
    
    const module = require('./lib/routers/' + name)
    module(routerContext);
}

loadRouter('web');
loadRouter('api');

if (process.env.NODE_ENV === "development") {
}

app.listen(port, () => {
    logger.info("listening on port %s", port);
});