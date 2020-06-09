import axios from 'axios'

class BackendClient {
    constructor(urlBase)
    {
        this._urlBase = urlBase;
    }

    get(url, params) {
        return this._execute('get', url, params, null);
    }

    delete(url, params) {
        return this._execute('delete', url, params, null);
    }

    post(url, data, params) {
        return this._execute('post', url, params, data);
    }

    put(url, data, params) {
        return this._execute('put', url, params, data);
    }

    _execute(method, url, params, data) {
        if (this._urlBase) {
            url = this._urlBase + url;
        }
        
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

        return axios(options)
            .then(result => {
                return result;
            })
            .catch(reason => {
                // showError(reason, options)
                throw reason;
            });
    }
}

export default BackendClient;
