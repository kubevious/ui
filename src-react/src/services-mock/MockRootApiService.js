import KubeviousService from './MockKubeviousService'

class MockRootApiService {
    constructor(state)
    {

    }

    kubevious(id) {
        return new KubeviousService(id)
    }
}

export default MockRootApiService

