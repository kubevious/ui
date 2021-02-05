import StateHandler from './state-handler'
import DiagramSource from './diagram-source'
import RootApiService from '../services/RootApiService';

class KubeviousHandler
{
    _api: RootApiService;
    _stateHandler: StateHandler;
    _diagramSource: DiagramSource;

    constructor(api: RootApiService)
    {
        this._api = api;

        console.log("[KubeviousHandler] :: create");

        this._stateHandler = new StateHandler(
            api.sharedState,
            api.diagramService());

        this._diagramSource = new DiagramSource(
            api.sharedState,
            api.socketService());
    }

    close(): void
    {
        console.log("[KubeviousHandler] :: destroy");

        this._stateHandler.close();
        this._diagramSource.close();
    }

}

export default KubeviousHandler;
