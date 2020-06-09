import StateHandler from './state-handler'
import DiagramSource from './diagram-source'

class KubeviousHandler
{
    constructor(api, info)
    {
        this._api = api;
        this._info = info;
    
        const diagramService = api.resolveService(info);
        
        this._stateHandler = new StateHandler(api.sharedState, diagramService);
        this._diagramSource = new DiagramSource(api.sharedState, api.socketService());
    }

    close()
    {
        // handle
    }

}

export default KubeviousHandler;