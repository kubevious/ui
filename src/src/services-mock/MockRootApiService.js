import KubeviousService from './MockKubeviousService'
import WebSocketService from './MockWebSocketService'

class MockRootApiService {
    constructor(sharedState)
    {
        this._sharedState = sharedState;
        this._socket = new WebSocketService(sharedState);
        this._kubevious = new KubeviousService(null, sharedState, this._socket);
    }

    get socket() {
        return this._socket;
    }

    kubevious(id) {
        return this._kubevious;
    }
}

export default MockRootApiService

