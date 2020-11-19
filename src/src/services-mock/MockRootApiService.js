import _ from 'the-lodash'

import BaseRootApiService from '../BaseRootApiService'

import DiagramService from './MockDiagramService'
import WebSocketService from './MockWebSocketService'
import RuleService from './MockRuleService'
import MarkerService from './MockMarkerService'
import MiscService from './MockMiscService';

class MockRootApiService extends BaseRootApiService
{
    constructor(sharedState)
    {
        super(sharedState);

        this.registerService({kind: 'rule'}, () => {
            return new RuleService(this, sharedState);
        });

        this.registerService({kind: 'marker'}, () => {
            return new MarkerService(this, sharedState);
        });

        this.registerService({kind: 'socket'}, () => {
            return new WebSocketService(sharedState);
        });

        this.registerService({kind: 'diagram'}, ({info}) => {
            return new DiagramService(sharedState);
        });

        this.registerService({ kind: 'misc' }, () => {
            return new MiscService(this, sharedState);
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

    miscService() {
        return this.registerService({ kind: 'misc' })
    }
}

export default MockRootApiService

