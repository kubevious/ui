import { IWebSocketService } from '@kubevious/ui-middleware';
import { WebSocketClient, WebSocketTarget, WebSocketSubscription, WebSocketScope } from '@kubevious/websocket-client';

export class WebSocketService implements IWebSocketService
{
    private _socket: WebSocketClient;

    constructor()
    {
        this._socket = new WebSocketClient('socket', {
            path: '/socket'
        });
        this._socket.run();
    }

    close()
    {
        this._socket.close();
    }

    subscribe(target: WebSocketTarget, cb: (value: any) => any) : WebSocketSubscription
    {
        return this._socket.subscribe(target, value => {
            cb(value);
        });
    }

    scope(cb: (value: any, target: WebSocketTarget) => any) : WebSocketScope
    {
        return this._socket.scope({}, cb);
    }

    updateContext(updatedContext: WebSocketTarget): void
    {
        this._socket.updateContext(updatedContext);
    }
}