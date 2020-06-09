class KubeviousService {

    constructor(client)
    {
        this._client = client;
    }

    fetchDiagram(cb) {
        return this._client.get('/tree')
            .then(result => {
                cb(result.data);
            })
    }

    fetchAssets(dn, cb) {
        return this._client.get('/assets', { dn: dn })
            .then(result => {
                cb(result.data);
            })
    }

    fetchSearchResults(criteria, cb) {
        return this._client.get('/search', { criteria: criteria })
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
                return this._client.get('/version')
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
        return this._client.get('/v1/history/range')
            .then(result => {
                cb(result.data);
            });
    }

    fetchHistoryTimeline(from, to, cb) {
        var params = {
            from: from,
            to: to
        };
        return this._client.get('/v1/history/timeline', params)
            .then(result => {
                cb(result.data);
            });
    }

    fetchHistorySnapshot(date, cb) {
        var params = {
            date: date
        };
        return this._client.get('/v1/history/snapshot', params)
            .then(result => {
                cb(result.data);
            });
    }

    fetchHistoryProperties(dn, date, cb) {
        var params = {
            dn: dn,
            date: date
        };
        return this._client.get('/v1/history/assets', params)
            .then(result => {
                cb(result.data);
            });
    }

}

export default KubeviousService