import _ from 'the-lodash';

import { HttpClient, ISharedState } from '@kubevious/ui-framework'
import { IWebSocketService } from '@kubevious/ui-middleware';
import { WebSocketTarget, WebSocketSubscription, WebSocketScope } from '@kubevious/ui-middleware';

export class BaseService
{
    private _client: HttpClient;
    private _sharedState: ISharedState;
    private _socket: IWebSocketService;

    private _socketHandlers : WebSocketSubscription[] = [];
    private _socketScopes : WebSocketScope [] = [];

    constructor(client: HttpClient, sharedState: ISharedState, socket: IWebSocketService)
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
            handler.close();
        }
        for(const scope of this._socketScopes)
        {
            scope.close();
        }
    }

    _socketSubscribe(target: WebSocketTarget, cb: (value: any) => any)
    {
        const handler = this.socket.subscribe(target, cb);
        this._socketHandlers.push(handler);
        return handler;
    }

    _subscribeSocketToSharedState(name: string, socketTarget: WebSocketTarget, defaultValue: any)
    {
        this.sharedState.set(name, defaultValue);

        this._socketSubscribe(socketTarget, value => {
            if (_.isNullOrUndefined(value)) {
                value = defaultValue;
            }
            this.sharedState.set(name, value)
        });
    }

    _socketScope(cb: (value: any, target: WebSocketTarget) => any)
    {
        const scope = this.socket.scope(cb);
        this._socketScopes.push(scope);
        return scope;
    }
}
