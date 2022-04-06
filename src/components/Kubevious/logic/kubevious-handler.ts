
import { app, ISharedState } from '@kubevious/ui-framework';
import { IWebSocketService, WebSocketKind} from '@kubevious/ui-middleware';

import { ClusterStatusSource } from './cluster-status-source'
import { DiagramSource } from '@kubevious/ui-browser'
import { PropertiesSource } from './props-source'
import { AlertsSource } from './alerts-source'
import { SummarySource } from './summary-source'
import { HistorySource } from './history-source'
import { NodeHistorySource } from './node-history-source'
import { ClusterService } from '../../../services/ClusterService';
import { HistoryService } from '../../../services/HistoryService';
import { DiagramBrowserService } from '../../../services/DiagramBrowserService';

import { MyGlobalState } from './global-state';

export class KubeviousHandler
{
    private _sharedState : ISharedState;
    // _stateHandler: StateHandler;
    private _diagramWebSocketService : IWebSocketService;
    private _clusterService : ClusterService;
    private _historyService : HistoryService;
    private _clusterStatusSource : ClusterStatusSource;
    private _diagramBrowsersService: DiagramBrowserService;
    private _diagramSource: DiagramSource;
    private _propsSource: PropertiesSource;
    private _alertsSource: AlertsSource;
    private _summarySource: SummarySource;
    private _historySource: HistorySource;
    private _nodeHistorySource: NodeHistorySource;

    private _currentDiagramContext : Record<string, any> = {};
    
    constructor(snapshotId?: string)
    {
        console.log("[KubeviousHandler] :: create");

        this._sharedState = app.sharedState.user();

        this._sharedState.set("need_markers_list", true);

        this._diagramWebSocketService = app.serviceRegistry.resolveService<IWebSocketService>({ kind: 'socket' });

        // this._diagramBrowsersService = app.serviceRegistry.resolveService<DiagramBrowserService>({ kind: 'diagram-browser' });
        this._diagramBrowsersService = new DiagramBrowserService(this._diagramWebSocketService);

        this._clusterService = app.serviceRegistry.resolveService<ClusterService>({ kind: 'cluster' });
        this._historyService = app.serviceRegistry.resolveService<HistoryService>({ kind: 'history' });

        this._sharedState.set('current_snapshot_id', null);

        this._clusterStatusSource = new ClusterStatusSource(
            this._sharedState,
            this._clusterService);

        this._diagramSource = new DiagramSource(this._diagramBrowsersService);

        this._propsSource = new PropertiesSource(
            this._sharedState,
            this._diagramWebSocketService);

        this._alertsSource = new AlertsSource(
            this._sharedState,
            this._diagramWebSocketService);

        this._summarySource = new SummarySource(
            this._sharedState,
            this._diagramWebSocketService);

        this._historySource = new HistorySource(
            this._sharedState,
            this._historyService);

        this._nodeHistorySource = new NodeHistorySource(
            this._sharedState,
            this._historyService);
    
        if (snapshotId)
        {
            this._currentDiagramContext['snapshotId'] = snapshotId;
            this._diagramWebSocketService.updateContext(this._currentDiagramContext)
        }
        else
        {
            this._processLatestSnapshot();
            this._processTargetSnapshot();
            this._processCurrentSnapshot();
        }

        MyGlobalState.diagramSource = this.diagramSource;
    }

    get diagramSource() {
        return this._diagramSource ;
    }

    private _processLatestSnapshot()
    {
        this._diagramWebSocketService.subscribe({
            kind: WebSocketKind.latest_snapshot_id
        }, (latest_snapshot_id) => { 
            this._sharedState.set('latest_snapshot_id', latest_snapshot_id);
        });
    }

    private _processTargetSnapshot()
    {
        this._sharedState.subscribe(
            ['latest_snapshot_id', 'time_machine_enabled', 'time_machine_actual_snapshot_id'], 
            ({
                latest_snapshot_id,
                time_machine_enabled,
                time_machine_actual_snapshot_id
            }) =>
        {

            if (time_machine_enabled && time_machine_actual_snapshot_id) {
                this._sharedState.set('current_snapshot_id', time_machine_actual_snapshot_id);
            } else {
                this._sharedState.set('current_snapshot_id', latest_snapshot_id);
            }

        }) 
    }

    private _processCurrentSnapshot()
    {
        this._sharedState.subscribe('current_snapshot_id', current_snapshot_id => {

            if (current_snapshot_id) {
                this._currentDiagramContext['snapshotId'] = current_snapshot_id;
            } else {
                delete this._currentDiagramContext['snapshotId'];
            }

            this._diagramWebSocketService.updateContext(this._currentDiagramContext)
        }) 
    }

    close(): void
    {
        console.log("[KubeviousHandler] :: destroy");

        MyGlobalState.diagramSource = undefined;

        this._summarySource.close();
        this._historySource.close();
        this._propsSource.close();
        this._diagramSource.close();
        this._clusterStatusSource.close();
        this._alertsSource.close();
        this._nodeHistorySource.close();

        this._diagramWebSocketService.close();
        this._clusterService.close();
        this._diagramBrowsersService.close();

        this._sharedState.close();

        this._sharedState.set('auto_pan_to_selected_dn', false);
        this._sharedState.set('need_markers_list', false);
        this._sharedState.set('current_cluster_id', null);
        this._sharedState.set('current_snapshot_id', null);

        this._diagramWebSocketService.updateContext({ })
    }

}
