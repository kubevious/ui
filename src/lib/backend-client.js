const axios = require("axios");

class BackendClient {
	constructor(logger) {
		this._logger = logger;
		this._rootUrl = process.env.BACKEND_URL;
	}

	get logger() {
		return this._logger;
	}

	get(url, params) {
		return this._execute("get", url, params, null);
	}

	post(url, data, params) {
		return this._execute("post", url, params, data);
	}

	_execute(method, url, params, data) {
		var options = {
			method: method,
			url: this._rootUrl + url
		};

		if (params) {
			options.params = params;
		}

		if (data) {
			options.data = data;
		}

		this.logger.info("Sending %s to %s...", options.method, options.url);
		return axios(options)
			.then(result => {
                this.logger.info("Done %s to %s. Status: %s.", options.method, options.url, result.status);
                return result;
			})
			.catch(reason => {
				this.logger.error("ERROR calling %s to %s", options.method, options.url, reason);
                throw reason;
			});
	}
}

module.exports = BackendClient;
