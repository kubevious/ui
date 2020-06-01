import _ from 'lodash'
import {
    ABOUT_DATA,
    ALERTS_DATA,
    GRAPH_DATA, HISTORY_GRAPH_DATA, HISTORY_PROPERTIES,
    HISTORY_RANGE, HISTORY_TIMELINE,
    PROPERTIES_DATA,
    SEARCH_DATA,
} from '../boot/diagramMockData'
import MockRuleService from './MockRuleService'
import MockMarkerService from './MockMarkerService'

class MockKubeviousService {
    constructor(clusterId, sharedState) {
        this.clusterId = clusterId
        this.sharedState = sharedState;

        this._ruleService = new MockRuleService(sharedState);
        this._markerService = new MockMarkerService(sharedState)

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

    fetchSearchResults(criteria, cb) {
        cb(SEARCH_DATA)
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