import BaseService from './BaseService'

class DiagramService extends BaseService {

    constructor(client, sharedState, socket)
    {
        super(client, sharedState, socket)

        this._setupWebSocket();
    }

    fetchDiagram(cb) {
        return this._client.get('/diagram/tree')
            .then(result => {
                cb(result.data);
            })
    }

    fetchAssets(dn, cb) {
        return this._client.get('/diagram/assets', { dn: dn })
            .then(result => {
                cb(result.data);
            })
    }

    fetchSearchResults(criteria, cb) {
        return this._client.get('/diagram/search', { criteria: criteria })
            .then(result => {
                cb(result.data);
            })
    }

    fetchHistoryRange(cb) {
        return this._client.get('/history/range')
            .then(result => {
                cb(result.data);
            });
    }

    fetchHistoryTimeline(from, to, cb) {
        var params = {
            from: from,
            to: to
        };
        return this._client.get('/history/timeline', params)
            .then(result => {
                cb(result.data);
            });
    }

    fetchHistorySnapshot(date, cb) {
        var params = {
            date: date
        };
        return this._client.get('/history/snapshot', params)
            .then(result => {
                cb(result.data);
            });
    }

    fetchHistoryProperties(dn, date, cb) {
        var params = {
            dn: dn,
            date: date
        };
        return this._client.get('/history/assets', params)
            .then(result => {
                cb(result.data);
            });
    }

    _setupWebSocket()
    {
        this._setupAssets();
    }

    _setupAssets()
    {
        var socketScope = this._socketScope((value, target) => {
            if (!this.sharedState.get('time_machine_enabled'))
            {
                if (target.dn == this.sharedState.get('selected_dn'))
                {
                    // TODO: Temporary change until backend returns the dn.
                    if (value)
                    {
                        if (value.alerts)
                        {
                            for(var alert of value.alerts)
                            {
                                if (!alert.dn)
                                {
                                    alert.dn = target.dn;
                                }
                            }
                        }
                    }
                    
                    this.sharedState.set('selected_object_assets', value);
                }
            }
        });

        this.sharedState.subscribe(['selected_dn', 'time_machine_enabled'],
            ({ selected_dn, time_machine_enabled }) => {

                var wsSubscriptions = []

                if (selected_dn) {
                    if (!time_machine_enabled) {
                        wsSubscriptions.push({ kind: 'assets', dn: selected_dn });
                    }
                }

                socketScope.replace(wsSubscriptions);
            })
    }
}

export default DiagramService