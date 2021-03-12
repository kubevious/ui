import _ from 'the-lodash'

import { WebSocketService } from './WebSocketService'
import { DiagramService } from './DiagramService'
import { RuleService } from './RuleService'
import { MarkerService } from './MarkerService'
import { MiscService } from './MiscService'

import { app } from '@kubevious/ui-framework';

export class RootApiService {
    constructor() {

        app.initHttpClient('');

        const sharedState = app.sharedState;

        app.registerService({ kind: 'socket' }, () => {
            return new WebSocketService();
        });

        app.registerService({ kind: 'rule' }, () => {
            const client = app.httpClient('/api/v1');
            return new RuleService(client, sharedState, this.socketService());
        });

        app.registerService({ kind: 'marker' }, () => {
            const client = app.httpClient('/api/v1');
            return new MarkerService(client, sharedState, this.socketService());
        });

        app.registerService({ kind: 'diagram' }, () => {
            const client = app.httpClient('/api/v1');
            return new DiagramService(client, sharedState, this.socketService());
        });

        app.registerService({ kind: 'misc' }, () => {
            const client = app.httpClient('');
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

    
}
