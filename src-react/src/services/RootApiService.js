import KubeviousService from './KubeviousService'
import WebSocketService from './WebSocketService'

class RootApiService {

    constructor(state)
    {
        this._kubevious = new KubeviousService();
        this._socket = new WebSocketService(state);
    }

    kubevious() {
        return this._kubevious;
    }

    socket() {
        return this._socket;
    }
}

export default RootApiService
