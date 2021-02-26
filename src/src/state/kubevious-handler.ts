import { StateHandler } from './state-handler'
import { DiagramSource } from './diagram-source'

import { app } from '@kubevious/ui-framework';
import { IDiagramService, IWebSocketService } from '@kubevious/ui-middleware/dist';

export class KubeviousHandler
{
    _stateHandler: StateHandler;
    _diagramSource: DiagramSource;

    constructor()
    {
        console.log("[KubeviousHandler] :: create");

        this._stateHandler = new StateHandler(
            app.sharedState,
            app.serviceRegistry.resolveService<IDiagramService>({ kind: 'diagram'}));

        this._diagramSource = new DiagramSource(
            app.sharedState,
            app.serviceRegistry.resolveService<IWebSocketService>({ kind: 'socket'}));
    }

    close(): void
    {
        console.log("[KubeviousHandler] :: destroy");

        this._stateHandler.close();
        this._diagramSource.close();
    }

}
