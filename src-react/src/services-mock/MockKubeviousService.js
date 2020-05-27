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

class MockKubeviousService {
    constructor(clusterId, state) {
        this.clusterId = clusterId
        this._state = state;

        this._ruleService = new MockRuleService(state);
    }

    fetchDiagram(cb) {
        cb(GRAPH_DATA)
    }

    fetchAssets(dn, cb) {
        cb(_.cloneDeep({
            props: PROPERTIES_DATA,
            alerts: ALERTS_DATA,
        }))
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
}

export default MockKubeviousService