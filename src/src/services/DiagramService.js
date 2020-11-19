import BaseService from './BaseService'
import moment from 'moment'

class DiagramService extends BaseService {

    constructor(client, sharedState, socket)
    {
        super(client, sharedState, socket)

        this._setupWebSocket();

        this._latestTimelinePreviewData = [];
        this._timelinePreviewHandlers = [];

        this._intervals = [];
        this._intervals.push(setInterval(() => {
            this._performTimelinePreviewQuery();
        }, 1 * 60 * 1000))

        this._performTimelinePreviewQuery();
    }

    close()
    {
        for(let i of this._intervals) {
            clearInterval(i);
        }
        this._intervals = [];
    }

    fetchDiagram(cb) {
        return this._client.get('/diagram/tree')
            .then(result => {
                cb(result.data);
            })
    }

    fetchProperties(dn, cb) {
        return this._client.get('/diagram/props', { dn: dn })
            .then(result => {
                cb(result.data);
            })
    }

    fetchAlerts(dn, cb) {
        return this._client.get('/diagram/alerts', { dn: dn })
            .then(result => {
                cb(result.data);
            })
    }

    fetchSearchResults(criteria, cb) {
        if (!criteria) {
            cb([]);
            return;
        }
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
            from: moment(from).toISOString(),
            to: moment(to).toISOString()
        };
        return this._client.get('/history/timeline', params)
            .then(result => {
                let data = result.data;
                for(let x of data)
                {
                    x.dateMoment = moment(x.date);
                }
                cb(data);
            });
    }

    subscribeTimelinePreview(cb) {
        this._timelinePreviewHandlers.push(cb);
        cb(this._latestTimelinePreviewData);
    }

    _performTimelinePreviewQuery()
    {
        this.fetchHistoryTimelinePreview(data => {
            this._latestTimelinePreviewData = data;
            for(let cb of this._timelinePreviewHandlers)
            {
                cb(data);
            }
        });
    }

    fetchHistoryTimelinePreview(cb) {
        var params = {
        };
        return this._client.get('/history/timeline', params)
            .then(result => {
                let data = result.data;
                for(let x of data)
                {
                    x.dateMoment = moment(x.date);
                }
                cb(data);
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

    fetchHistoryProps(dn, date, cb) {
        var params = {
            dn: dn,
            date: date
        };
        return this._client.get('/history/props', params)
            .then(result => {
                cb(result.data);
            });
    }

    fetchHistoryAlerts(dn, date, cb) {
        var params = {
            dn: dn,
            date: date
        };
        return this._client.get('/history/alerts', params)
            .then(result => {
                cb(result.data);
            });
    }

    _setupWebSocket()
    {
        this._setupProperties();
        this._setupAlerts();
    }

    _setupProperties()
    {
        var socketScope = this._socketScope((value, target) => {
            if (!this.sharedState.get('time_machine_enabled'))
            {
                if (target.dn == this.sharedState.get('selected_dn'))
                {
                    this.sharedState.set('selected_object_props', value);
                }
            }
        });

        this.sharedState.subscribe(['selected_dn', 'time_machine_enabled'],
            ({ selected_dn, time_machine_enabled }) => {

                var wsSubscriptions = []

                if (selected_dn) {
                    if (!time_machine_enabled) {
                        wsSubscriptions.push({ kind: 'props', dn: selected_dn });
                    }
                }

                socketScope.replace(wsSubscriptions);
            })
    }


    _setupAlerts()
    {
        var socketScope = this._socketScope((value, target) => {
            if (!this.sharedState.get('time_machine_enabled'))
            {
                if (target.dn == this.sharedState.get('selected_dn'))
                {
                    this.sharedState.set('selected_raw_alerts', value);
                }
            }
        });

        this.sharedState.subscribe(['selected_dn', 'time_machine_enabled'],
            ({ selected_dn, time_machine_enabled }) => {

                var wsSubscriptions = []

                if (selected_dn) {
                    if (!time_machine_enabled) {
                        wsSubscriptions.push({ kind: 'alerts', dn: selected_dn });
                    }
                }

                socketScope.replace(wsSubscriptions);
            })
    }
}

export default DiagramService