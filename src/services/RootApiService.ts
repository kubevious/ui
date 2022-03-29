import _ from 'the-lodash'

import { WebSocketService } from './WebSocketService'
import { DiagramService } from './DiagramService'
import { RuleService } from './RuleService'
import { MarkerService } from './MarkerService'
import { MiscService } from './MiscService'

import { app } from '@kubevious/ui-framework';

export class RootApiService {
    constructor() {

        this._registerHttpClients();

        const sharedState = app.sharedState;

        app.registerService({ kind: 'socket' }, () => {
            return new WebSocketService();
        });

        app.registerService({ kind: 'rule' }, () => {
            const client = this.httpClient('/api/v1');
            return new RuleService(client);
        });

        app.registerService({ kind: 'marker' }, () => {
            const client = this.httpClient('/api/v1');
            return new MarkerService(client);
        });

        app.registerService({ kind: 'diagram' }, () => {
            const client = this.httpClient('/api/v1');
            return new DiagramService(client, sharedState, this.socketService());
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

    diagramService(params) {
        let info;
        if (params) {
            info = _.clone(params);
        } else {
            info = {}
        }
        info.kind = 'diagram';
        return app.serviceRegistry.resolveService<DiagramService>(info);
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
