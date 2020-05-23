const Server = require('./server');
const BackendClient = require('./backend-client');

class Context {
	constructor(logger) {
        this._logger = logger;
        
        this._server = new Server(this);
        this._backendClient = new BackendClient(logger);
	}

	get logger() {
		return this._logger;
    }

    get server() {
        return this._server;
    }

    get backendClient() {
        return this._backendClient;
    }

    get mysqlDriver() {
        return this._mysqlDriver;
    }

    run()
    {
        this.logger.info("[run] BEGIN");
        return Promise.resolve()
            .then(() => this._server.run())
            .catch(reason => {
                console.log("***** ERROR *****");
                console.log(reason);
                this.logger.error(reason);
                process.exit(1);
            });
    }

}

module.exports = Context;
