import KubeviousService from './MockKubeviousService'

class MockRootApiService {
    constructor(state)
    {
        this._state = state;
        this._kubevious = new KubeviousService(null, state);
    }

    kubevious(id) {
        return this._kubevious;
    }
}

export default MockRootApiService

