import DiagramRootApiService from './DiagramRootApiService'

class RootApiService {

    constructor(state)
    {
        this._diagram = new DiagramRootApiService(state);
    }

    diagram() {
        return this._diagram;
    }

}

export default RootApiService

