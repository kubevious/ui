import MockDiagramRootApiService from './MockDiagramRootApiService'

class MockRootApiService {
    constructor(sharedState)
    {
        this._diagram = new MockDiagramRootApiService(sharedState);
    }

    diagram() {
        return this._diagram;
    }
}

export default MockRootApiService

