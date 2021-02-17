import _ from 'the-lodash';

import { BackendClient, ISharedState } from '@kubevious/ui-framework'
import { IWebSocketService } from '@kubevious/ui-middleware/dist';

export class BaseService
{
    private _client: BackendClient;
    private _sharedState: ISharedState;
    private _socket: IWebSocketService;


    private _socketHandlers : any [] = [];
    private _socketScopes : any [] = [];

    constructor(client: BackendClient, sharedState: ISharedState, socket: IWebSocketService)
    {
        console.log('[BaseService] ' + this.constructor.name + ' :: create');

        this._client = client;
        this._sharedState = sharedState;
        this._socket = socket;

        if (!this.client) {
            throw new Error("Client not provided");
        }
        if (!this.sharedState) {
            throw new Error("SharedState not provided");
        }
    }

    get client() {
        return this._client;
    }

    get sharedState() {
        return this._sharedState;
    }

    get socket() {
        return this._socket;
    }

    close()
    {
        console.log('[BaseService] ' + this.constructor.name + ' :: destroy');

        for(const handler of this._socketHandlers)
        {
            handler.stop();
        }
        for(const scope of this._socketScopes)
        {
            scope.close();
        }
    }

    _socketSubscribe(target, cb)
    {
        const handler = this.socket.subscribe(target, cb);
        this._socketHandlers.push(handler);
        return handler;
    }

    _subscribeSocketToSharedState(name, socketTarget, defaultValue)
    {
        this.sharedState.set(name, defaultValue);

        this._socketSubscribe(socketTarget, value => {
            if (_.isNullOrUndefined(value)) {
                value = defaultValue;
            }
            this.sharedState.set(name, value)
        });
    }

    _socketScope(cb)
    {
        const scope = this.socket.scope(cb);
        this._socketScopes.push(scope);
        return scope;
    }
}
