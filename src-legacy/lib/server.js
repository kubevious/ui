
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const PromiseRouter = require('express-promise-router');

class Server
{
    constructor(context)
    {
        this._logger = context.logger.sublogger('server');
        this._context = context;
    }

    get logger() {
        return this._logger;
    }

    run()
    {
        this.logger.info("[run] BEGIN");

        this._app = express();

        this._setupReloadify();
        
        this._app.use(express.static(path.resolve(__dirname, '../static')));

        this._app.engine('html', ejs.renderFile);
        this._app.engine('js', ejs.renderFile);
        this._app.set('views', path.resolve(__dirname, '../views'));
        this._app.set('view engine', 'html');
        
        this._setupHttps();

        this._loadRouters();

        this._runServer();
    }

    _loadRouters()
    {
        this._loadRouter('web');
        // this._loadRouter('history');
        this._loadRouter('api');
    }

    _loadRouter(name)
    {
        this.logger.info("Loading router %s...", name);

        const router = PromiseRouter();

        var routerContext = {
            logger: this.logger.sublogger(name),
            backend: this._context.backendClient,
            history: this._context.historySnapshotReader,
            router,
            app: this._app
        }
        
        const module = require('./routers/' + name)
        module(routerContext);
    }

    _setupReloadify()
    {
        var reloadify = require('./reloadify');
        reloadify(this._app, path.resolve(__dirname, '../static'));
    }

    _setupHttps()
    {
        if (process.env.FORCE_HTTPS)
        {
            function ensureSecure(req, res, next)
            {
                if (req.get('X-Forwarded-Proto') == 'http')
                {
                    res.redirect('https://' + req.hostname + req.url);
                }
                else
                {
                    next();
                }
            }
            this._app.use(ensureSecure);
        }
    }

    _runServer()
    {
        this.logger.info("[_runServer] BEGIN");
        const port = 3000;
        this._app.listen(port, () => {
            this.logger.info("listening on port %s", port);
        }); 
    }
}

module.exports = Server;