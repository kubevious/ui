import axios from 'axios'

class BackendClient {
    constructor(urlBase, sharedState)
    {
        this._urlBase = urlBase;
        this._sharedState = sharedState;
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
                this._sharedState.set('is_error', true)
                this._sharedState.set('error', reason)

                setTimeout(() => {
                    this._sharedState.set('is_error', false)
                    this._sharedState.set('error', null)
                }, 3000)

                throw reason;
            });
    }
}

export default BackendClient;
