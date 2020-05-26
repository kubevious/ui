import KubeviousService from './KubeviousService'

class RootApiService {
    kubevious() {
        return new KubeviousService()
    }
}

export default new RootApiService()

