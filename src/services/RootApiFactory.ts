import { WebSocketService } from './WebSocketService'
import { RuleService } from './RuleService'
import { MarkerService } from './MarkerService'
import { WorldviousService } from './WorldviousService'
import { ClusterService } from './ClusterService';
import { HistoryService } from './HistoryService';
import { SearchService } from './SearchService'
import { GuardService } from './GuardService';
import { ValidatorService } from './ValidatorService';
import { BackendStatusService } from './BackendStatusService';
import { DeveloperService } from './DeveloperService';

import { app } from '@kubevious/ui-framework';

export class RootApiFactory {
    constructor() {

        this._registerHttpClients();
        this._registerServices();
        
    }

    socketService() {
        return app.serviceRegistry.resolveService<WebSocketService>({ kind: 'socket' });
    }
    
    private _registerHttpClients()
    {
        app.initHttpClient({ level: 'root' });
    }

    private _registerServices()
    {
        app.registerService({ kind: 'socket' }, () => {
            return new WebSocketService();
        });

        app.registerService({ kind: 'backend-status' }, () => {
            const client = this.httpClient('/api/v1');
            return new BackendStatusService(client);
        });

        app.registerService({ kind: 'cluster' }, () => {
            const client = this.httpClient('/api/v1/cluster');
            return new ClusterService(client);
        });

        app.registerService({ kind: 'history' }, () => {
            const client = this.httpClient('/api/v1/history');
            return new HistoryService(client);
        });

        app.registerService({ kind: 'rule' }, () => {
            const client = this.httpClient('/api/v1/rule-engine');
            return new RuleService(client);
        });

        app.registerService({ kind: 'marker' }, () => {
            const client = this.httpClient('/api/v1/rule-engine');
            return new MarkerService(client);
        });

        app.registerService({ kind: 'validator' }, () => {
            const client = this.httpClient('/api/v1/validators');
            return new ValidatorService(client);
        });

        app.registerService({ kind: 'search' }, () => {
            const client = this.httpClient('/api/v1/search');
            return new SearchService(client);
        });

        app.registerService({ kind: 'guard' }, () => {
            const client = this.httpClient('/api/v1/guard');
            return new GuardService(client);
        });

        app.registerService({ kind: 'worldvious' }, () => {
            const client = this.httpClient('/api/v1/support');
            return new WorldviousService(client);
        });

        app.registerService({ kind: 'developer' }, () => {
            const client = this.httpClient('/api/v1');
            return new DeveloperService(client);
        });
    }

    private httpClient(urlBase: string)
    {
        return app.httpClient({ level: 'root' }, urlBase);
    }

}
