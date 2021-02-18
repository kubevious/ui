import WebSocketSubscriptionClient from 'websocket-subscription-client';
import _ from 'the-lodash'
import { IWebSocketService } from '@kubevious/ui-middleware';

export class WebSocketService implements IWebSocketService
{
    private _socket: any;

    constructor()
    {
        this._socket = new WebSocketSubscriptionClient('/socket');
        this._socket.run();
    }

    close()
    {
        this._socket.close();
    }

    subscribe(target: any, cb: (value: any) => any): any
    {
        return this._socket.subscribe(target, value => {
            cb(value);
        });
    }

    scope(cb: (value: any, target: any) => any): any
    {
        return this._socket.scope(cb);
    }
}