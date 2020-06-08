import MockDiagramRootApiService from './MockDiagramRootApiService'

class MockRootApiService {
    diagram(sharedState) {
        return new MockDiagramRootApiService(sharedState)
    }
}

export default new MockRootApiService()

