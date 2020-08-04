import _ from 'the-lodash'

import BaseRootApiService from '../BaseRootApiService'
import BackendClient from './BackendClient'

import WebSocketService from './WebSocketService'
import DiagramService from './DiagramService'
import RuleService from './RuleService'
import MarkerService from './MarkerService'
import MiscService from './MiscService'

class RootApiService extends BaseRootApiService {
    constructor(sharedState) {
        super(sharedState);

        this.registerService({ kind: 'socket' }, () => {
            return new WebSocketService();
        });

        this.registerService({ kind: 'rule' }, () => {
            var client = new BackendClient('/api/v1', sharedState);
            return new RuleService(client, sharedState, this.socketService());
        });

        this.registerService({ kind: 'marker' }, () => {
            var client = new BackendClient('/api/v1', sharedState);
            return new MarkerService(client, sharedState, this.socketService());
        });

        this.registerService({ kind: 'diagram' }, ({ info }) => {
            var client = new BackendClient('/api', sharedState);
            return new DiagramService(client, sharedState, this.socketService());
        });

        this.registerService({ kind: 'misc' }, () => {
            var client = new BackendClient(null, sharedState);
            return new MiscService(client);
        });
    }

    socketService() {
        return this.resolveService({ kind: 'socket' });
    }

    ruleService() {
        return this.resolveService({ kind: 'rule' });
    }

    markerService() {
        return this.resolveService({ kind: 'marker' });
    }

    diagramService(params) {
        var info;
        if (params) {
            info = _.clone(params);
        } else {
            info = {}
        }
        info.kind = 'diagram';
        return this.resolveService(info);
    }

    miscService() {
        return this.resolveService({ kind: 'misc' });
    }

    
}

export default RootApiService

