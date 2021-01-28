import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import RemoteTrack from '../utils/remote-track';

class BackendClient {
    private _urlBase: string
    private _remoteTrack: RemoteTrack
    private _headers: Record<string, string>
    constructor(urlBase: string, sharedState: {}, headers: Record<string, string>)
    {
        this._urlBase = urlBase;
        this._remoteTrack = new RemoteTrack(sharedState);
        this._headers = headers || {};
    }

    get(
        url: string,
        params?: Record<string, string> | unknown
    ): Promise<AxiosResponse<any>> {
        return this._execute('get', url, params, null);
    }

    delete(
        url: string,
        params?: Record<string, string> | unknown
    ): Promise<AxiosResponse<any>> {
        return this._execute('delete', url, params, null);
    }

    post(
        url: string,
        data: Record<string, string>,
        params?: Record<string, string>
    ): Promise<AxiosResponse<any>> {
        return this._execute('post', url, params, data);
    }

    put(
        url: string,
        data: Record<string, string>,
        params: Record<string, string>
    ): Promise<AxiosResponse<any>> {
        return this._execute('put', url, params, data);
    }

    _execute(
        method: AxiosRequestConfig['method'],
        url: string,
        params?: Record<string, string> | unknown,
        data?: Record<string, string> | null,
    ): Promise<AxiosResponse<any>> {
        if (this._urlBase) {
            url = this._urlBase + url;
        }
        
        const options: AxiosRequestConfig = {
            method: method,
            url: url,
            headers: this._headers
        };

        if (params) {
            options.params = params;
        }

        if (data) {
            options.data = data;
        }
        
        const operation = this._remoteTrack.start({
            action: `${options.method?.toUpperCase()}::${options.url}`,
            options
        })

        return axios(options)
            .then((result: AxiosResponse<any>) => {
                operation.complete()
                return result;
            })
            .catch((reason: AxiosError<any>) => {
                let data = reason.message;
                let status = 0;
                if (reason.response) {
                    data = reason.response.data;
                    status = reason.response.status;
                }
                operation.fail({
                    data,
                    status
                })
                throw reason;
            });
    }
}

export default BackendClient;
