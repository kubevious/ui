import KubeviousService from './MockKubeviousService'

class MockRootApiService {
    kubevious(id) {
        return new KubeviousService(id)
    }
}

export default new MockRootApiService()

