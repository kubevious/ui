import { app, BaseHttpService } from '@kubevious/ui-framework'
import { ClusterReportingStatus } from '@kubevious/ui-middleware';
import { IWebSocketService } from '@kubevious/ui-middleware';
import { WebSocketKind } from './types';

export class ClusterService extends BaseHttpService
{
    private _ws? : IWebSocketService;

    close()
    {
        super.close();
        if (this._ws) {
            this._ws.close();
        }
    }

    fetchClusterReportStatus() {
        return this.client
            .get<ClusterReportingStatus>(`/reporting_status`)
            .then((result) => result.data)
    }

    subscribeClusterReportStatus(cb: ((value: ClusterReportingStatus) => void))
    {
        const target = {
            kind: WebSocketKind.cluster_reporting_status,
        }
        return this._getSocket().subscribe(target, (value) => {
            cb(value);
        })
    }

    private _getSocket() : IWebSocketService
    {
        if (this._ws) {
            return this._ws;
        }
        this._ws = app.serviceRegistry.resolveService<IWebSocketService>({ kind: 'socket' });
        return this._ws;
    }
}
