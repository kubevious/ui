import WebSocketSubscriptionClient from 'websocket-subscription-client';
import _ from 'the-lodash'

class WebSocketService
{
    constructor()
    {
        this._socket = new WebSocketSubscriptionClient('/socket');
        this._socket.run();
    }

    close()
    {
        this._socket.close();
    }

    subscribe(target, cb)
    {
        return this._socket.subscribe(target, value => {
            cb(value);
        });
    }

    scope(cb)
    {
        return this._socket.scope(cb);
    }
}

export default WebSocketService;
