import StateHandler from './state-handler'
import DiagramSource from './diagram-source'

class KubeviousHandler
{
    constructor(api, info)
    {
        this._api = api;
        this._info = info;

        console.log("[KubeviousHandler] :: create", this._info);

        this._diagramService = api.diagramService();
        this._websocketService = api.socketService(info);
        
        this._stateHandler = new StateHandler(api.sharedState, this._diagramService);
        this._diagramSource = new DiagramSource(api.sharedState, this._websocketService);
    }

    close()
    {
        console.log("[KubeviousHandler] :: destroy", this._info);

        this._stateHandler.close();
        this._diagramSource.close();
    }

}

export default KubeviousHandler;