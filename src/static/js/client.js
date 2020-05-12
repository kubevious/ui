class BackendClient {
	constructor() {
	}

	get(url, params) {
		return this._execute("get", url, params, null);
	}

	delete(url, params) {
		return this._execute("delete", url, params, null);
	}

	post(url, data, params) {
		return this._execute("post", url, params, data);
	}

	put(url, data, params) {
		return this._execute("put", url, params, data);
	}

	_execute(method, url, params, data) {
		var options = {
			method: method,
			url: url
		};

		if (params) {
			options.params = params;
		}

		if (data) {
			options.data = data;
		}

		Logger.info("Sending %s to %s...", options.method, options.url);
		return axios(options)
			.then(result => {
                Logger.info("Done %s to %s. Status: %s.", options.method, options.url, result.status);
                return result;
			})
			.catch(reason => {
				Logger.error("ERROR calling %s to %s", options.method, options.url, reason);
				showError(reason, options)
                throw reason;
			});
	}
}

var backend = new BackendClient();
