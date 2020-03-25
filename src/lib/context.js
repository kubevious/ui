const Server = require('./server');
const BackendClient = require('./backend-client');
const MySqlDriver = require("kubevious-helpers").MySqlDriver;
const SnapshotReader = require('./history/snapshot-reader');

class Context {
	constructor(logger) {
        this._logger = logger;
        
        this._server = new Server(this);
        this._backendClient = new BackendClient(logger);
        this._mysqlDriver = new MySqlDriver(logger);
        this._snapshotReader = new SnapshotReader(logger, this._mysqlDriver);
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

    get snapshotReader() {
        return this._snapshotReader;
    }

    run()
    {
        this.logger.info("[run] BEGIN");
        return Promise.resolve()
            .then(() => this._mysqlDriver.connect())
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
