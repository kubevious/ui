const logger = require('./logger');
logger.info("init");

const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();
const PromiseRouter = require('express-promise-router');

// view engine setup
app.engine('html', ejs.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

var reloadify = require('./lib/reloadify');
reloadify(app, __dirname + '/static');

if (process.env.FORCE_HTTPS)
{
    function ensureSecure(req, res, next) {
        if (req.get('X-Forwarded-Proto')=='https' || req.hostname == 'localhost')
        {
            next();
        }
        else if(req.get('X-Forwarded-Proto')!='https' && req.get('X-Forwarded-Port')!='443')
        {
            res.redirect('https://' + req.hostname + req.url);
        }
    }
    app.use(ensureSecure);
}

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

const port = 3000;
app.listen(port, () => {
    logger.info("listening on port %s", port);
});