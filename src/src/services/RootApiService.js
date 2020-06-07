import KubeviousService from './KubeviousService'
import WebSocketService from './WebSocketService'

class RootApiService {

    constructor(state)
    {
        this._socket = new WebSocketService(state);
        this._kubevious = new KubeviousService(state, this._socket);
    }

    kubevious() {
        return this._kubevious;
    }

    get socket() {
        return this._socket;
    }
}

export default RootApiService

