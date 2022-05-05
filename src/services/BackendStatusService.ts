import { BaseHttpService } from '@kubevious/ui-framework';
import { BackendMetricsResponse, BackendVersionResponse, IBackendStatusService } from '@kubevious/ui-middleware';

export class BackendStatusService extends BaseHttpService implements IBackendStatusService {

    getVersion()
    {
        return this.client.get<BackendVersionResponse>('/version')
            .then(result => {
                return result?.data;
            })
    }

    getMetrics()
    {
        return this.client.get<BackendMetricsResponse>('/metrics')
            .then(result => {
                return result?.data;
            })
    }

}
