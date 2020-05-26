import BackendClient  from './BackendClient'
import RuleService from './RuleService'

class KubeviousService {
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
        return BackendClient.get('/about')
            .then(result => {
                cb(result.data);
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
        return new RuleService()
    }

}

export default KubeviousService