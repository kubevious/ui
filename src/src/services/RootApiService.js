import _ from 'the-lodash'

import BaseRootApiService from '../BaseRootApiService'
import BackendClient from './BackendClient'

import WebSocketService from './WebSocketService'
import KubeviousService from './KubeviousService'
import RuleService from './RuleService'
import MarkerService from './MarkerService'

class RootApiService extends BaseRootApiService
{
    constructor(sharedState)
    {
        super(sharedState);

        this.registerService({kind: 'rule'}, () => {
            var client = new BackendClient('/api/v1');
            return new RuleService(client);
        });

        this.registerService({kind: 'marker'}, () => {
            var client = new BackendClient('/api/v1');
            return new MarkerService(client);
        });

        this.registerService({kind: 'socket'}, () => {
            return new WebSocketService(sharedState);
        });

        this.registerService({kind: 'diagram'}, ({info}) => {
            var client = new BackendClient('/api');
            return new KubeviousService(client);
        });
    }

    socketService() {
        return this.resolveService({kind: 'socket'});
    }

    ruleService() {
        return this.resolveService({kind: 'rule'});
    }

    markerService() {
        return this.resolveService({kind: 'marker'});
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
}

export default RootApiService

