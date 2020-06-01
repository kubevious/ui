import KubeviousService from './MockKubeviousService'

class MockRootApiService {
    constructor(sharedState)
    {
        this._sharedState = sharedState;
        this._kubevious = new KubeviousService(null, sharedState);
    }

    kubevious(id) {
        return this._kubevious;
    }
}

export default MockRootApiService

