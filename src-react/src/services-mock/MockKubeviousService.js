import _ from 'lodash'
import {
    ABOUT_DATA,
    ALERTS_DATA,
    GRAPH_DATA, HISTORY_GRAPH_DATA, HISTORY_PROPERTIES,
    HISTORY_RANGE, HISTORY_TIMELINE,
    PROPERTIES_DATA,
    DN_LIST
} from '../boot/diagramMockData'
import MockRuleService from './MockRuleService'
import MockMarkerService from './MockMarkerService'

class MockKubeviousService {
    constructor(clusterId, sharedState) {
        this.clusterId = clusterId
        this.sharedState = sharedState;

        this._ruleService = new MockRuleService(this, sharedState);
        this._markerService = new MockMarkerService(this, sharedState)

        this.sharedState.subscribe(['selected_dn', 'time_machine_enabled'],
            ({ selected_dn, time_machine_enabled }) => {

                if (selected_dn) {
                    if (!time_machine_enabled) {
                        this.fetchAssets(selected_dn, (data) => {
                            this.sharedState.set('selected_object_assets', data);
                        })
                    }
                }
            });
    }

    fetchDiagram(cb) {
        cb(GRAPH_DATA)
    }

    fetchAssets(dn, cb) {
        setTimeout(() => {
            cb(_.cloneDeep({
                props: PROPERTIES_DATA,
                alerts: ALERTS_DATA,
            }))
        }, 200);
    }

    getRandomDnList()
    {
        const count = this._randomInt(10) + 3;
        var res = [];

        for(var i = 0; i < count; i++)
        {
            var dn = DN_LIST[this._randomInt(DN_LIST.length)];
            res.push(dn)
        }
        return res;
    }

    fetchSearchResults(criteria, cb) {
        var res = this.getRandomDnList();
        res = res.map(x => ({
            dn: x
        }));
        cb(res);
    }

    _randomInt(x)
    {
        return Math.floor(Math.random() * x); 
    }

    fetchAbout(cb) {
        cb(ABOUT_DATA)
    }

    fetchHistoryRange(cb) {
        cb(HISTORY_RANGE)
    }

    fetchHistoryTimeline(from, to, cb) {
        cb(HISTORY_TIMELINE)
    }

    fetchHistorySnapshot(date, cb) {
        cb(HISTORY_GRAPH_DATA)
    }

    fetchHistoryProperties(dn, date, cb) {
        cb(_.cloneDeep(HISTORY_PROPERTIES))
    }

    rules() {
        return this._ruleService;
    }

    markers() {
        return this._markerService
    }
}

export default MockKubeviousService