import { ISharedState } from '@kubevious/ui-framework';
import { ClusterService } from '../../../services/ClusterService';

export class ClusterStatusSource {
    private _sharedState: ISharedState;
    private _clusterService: ClusterService;

    constructor(sharedState: ISharedState, clusterService: ClusterService) {
        if (!sharedState) {
            throw new Error('SharedState not provided');
        }
        if (!clusterService) {
            throw new Error('ClusterService not provided');
        }

        this._sharedState = sharedState;
        this._clusterService = clusterService;

        this._sharedState.set('current_cluster_report_status', null);
        this._clusterService.subscribeClusterReportStatus((value) => {
            this._sharedState.set('current_cluster_report_status', value);
        });
    }

    close() {
        this._sharedState.set('current_cluster_report_status', null);

        this._sharedState.close();
    }
}
