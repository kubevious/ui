import axios from 'axios'
import RemoteTrack from '../utils/remote-track';

class BackendClient {
    constructor(urlBase, sharedState)
    {
        this._urlBase = urlBase;
        this._sharedState = sharedState;
        this._remoteTrack = new RemoteTrack(sharedState)
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

        this._remoteTrack.start({
            action: `${options.method.toUpperCase()}::${options.url}`
        })

        return axios(options)
            .then(result => {
                this._remoteTrack.complete()
                return result;
            })
            .catch(reason => {
                this._remoteTrack.fail(reason)
                throw reason;
            });
    }
}

export default BackendClient;
