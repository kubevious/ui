import _ from 'the-lodash'

import { WebSocketService } from './WebSocketService'
import { RuleService } from './RuleService'
import { MarkerService } from './MarkerService'
import { MiscService } from './MiscService'
import { ClusterService } from './ClusterService';
import { HistoryService } from './HistoryService';
import { SearchService } from './SearchService'

import { app } from '@kubevious/ui-framework';

export class RootApiFactory {
    constructor() {

        this._registerHttpClients();

        const sharedState = app.sharedState;

        app.registerService({ kind: 'socket' }, () => {
            return new WebSocketService();
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

        app.registerService({ kind: 'search' }, () => {
            const client = this.httpClient('/api/v1');
            return new SearchService(client);
        });

        app.registerService({ kind: 'misc' }, () => {
            const client = this.httpClient('');
            return new MiscService(client, sharedState, this.socketService());
        });
    }

    socketService() {
        return app.serviceRegistry.resolveService<WebSocketService>({ kind: 'socket' });
    }

    ruleService() {
        return app.serviceRegistry.resolveService<RuleService>({ kind: 'rule' });
    }

    markerService() {
        return app.serviceRegistry.resolveService<MarkerService>({ kind: 'marker' });
    }
    
    miscService() {
        return app.serviceRegistry.resolveService<MiscService>({ kind: 'misc' });
    }

    
    private _registerHttpClients()
    {
        app.initHttpClient({ level: 'root' });
    }

    private httpClient(urlBase: string)
    {
        return app.httpClient({ level: 'root' }, urlBase);
    }

}
