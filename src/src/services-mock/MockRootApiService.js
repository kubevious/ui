import _ from 'the-lodash'

import BaseRootApiService from '../BaseRootApiService'

import KubeviousService from './MockKubeviousService'
import WebSocketService from './MockWebSocketService'
import MockRuleService from './MockRuleService'
import MockMarkerService from './MockMarkerService'

class MockRootApiService extends BaseRootApiService
{
    constructor(sharedState)
    {
        super(sharedState);

        this.registerService({kind: 'rule'}, () => {
            return new MockRuleService(this, sharedState);
        });

        this.registerService({kind: 'marker'}, () => {
            return new MockMarkerService(this, sharedState);
        });

        this.registerService({kind: 'socket'}, () => {
            return new WebSocketService(sharedState);
        });

        this.registerService({kind: 'diagram'}, ({info}) => {
            return new KubeviousService(sharedState);
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

export default MockRootApiService

