import BackendClient  from './BackendClient'
import RuleService from './RuleService'
import MarkerService from './MarkerService'

class KubeviousService {
    constructor(state, socket)
    {
        this._socket = socket;
        this._ruleService = new RuleService(state);
        this._markerService = new MarkerService(state);
    }

    get socket() {
        return this._socket;
    }

    fetchDiagram(cb) {
        return BackendClient.get('/api/tree')
            .then(result => {
                cb(result.data);
            })
    }

    fetchAssets(dn, cb) {
        return BackendClient.get('/api/assets', { dn: dn })
            .then(result => {
                cb(result.data);
            })
    }

    fetchSearchResults(criteria, cb) {
        return BackendClient.get('/api/search', { criteria: criteria })
            .then(result => {
                cb(result.data);
            })
    }

    fetchAbout(cb) {
        var info = {
            version: require('../version')
        }
                  
        return Promise.resolve()
            .then(() => {
                return BackendClient.get('/version')
                    .then(result => {
                        info['backend version'] = result.data.version;
                    })
                    .catch(reason => {
                        info['backend version'] = "unknown";
                    });
            })
            .then(() => {
                cb(info);
            });
  
    }

    fetchHistoryRange(cb) {
        return BackendClient.get('/api/v1/history/range')
            .then(result => {
                cb(result.data);
            });
    }

    fetchHistoryTimeline(from, to, cb) {
        var params = {
            from: from,
            to: to
        };
        return BackendClient.get('/api/v1/history/timeline', params)
            .then(result => {
                cb(result.data);
            });
    }

    fetchHistorySnapshot(date, cb) {
        var params = {
            date: date
        };
        return BackendClient.get('/api/v1/history/snapshot', params)
            .then(result => {
                cb(result.data);
            });
    }

    fetchHistoryProperties(dn, date, cb) {
        var params = {
            dn: dn,
            date: date
        };
        return BackendClient.get('/api/v1/history/assets', params)
            .then(result => {
                cb(result.data);
            });
    }

    rules() {
        return this._ruleService;
    }

    markers() {
        return this._markerService;
    }

}

export default KubeviousService