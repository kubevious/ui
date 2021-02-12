import _ from 'the-lodash'

import { WebSocketService } from './WebSocketService'
import { DiagramService } from './DiagramService'
import { RuleService } from './RuleService'
import { MarkerService } from './MarkerService'
import { MiscService } from './MiscService'

import { app } from '@kubevious/ui-framework';

export class RootApiService {
    constructor() {

        const sharedState = app.sharedState;

        app.registerService({ kind: 'socket' }, () => {
            return new WebSocketService();
        });

        app.registerService({ kind: 'rule' }, () => {
            var client = app.backendClient('/api/v1');
            return new RuleService(client, sharedState, this.socketService());
        });

        app.registerService({ kind: 'marker' }, () => {
            var client = app.backendClient('/api/v1');
            return new MarkerService(client, sharedState, this.socketService());
        });

        app.registerService({ kind: 'diagram' }, () => {
            var client = app.backendClient('/api/v1');
            return new DiagramService(client, sharedState, this.socketService());
        });

        app.registerService({ kind: 'misc' }, () => {
            var client = app.backendClient('');
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
        var info;
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
