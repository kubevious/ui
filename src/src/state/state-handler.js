import _ from 'the-lodash'
import { splitDn } from '../utils/naming-utils'
import FieldsSaver from '../utils/save-fields';
import moment from 'moment'

class StateHandler {
    constructor(sharedState, diagramService) {
        if (!sharedState) {
            throw new Error("SharedState not provided");
        }
        if (!diagramService) {
            throw new Error("DiagramService not provided");
        }

        this.sharedState = sharedState.user();
        this._service = diagramService;
        this._fieldsSaver = new FieldsSaver('Diagram')
        this._setup();
    }

    close()
    {
        this._service.close();
        this.sharedState.close();
    }

    _setup() {
        this.sharedState.set('is_loading', false)
        this.sharedState.set('is_error', false)
        this.sharedState.set('error', null)
        this.sharedState.set('diagram_expanded_dns', { 'root': true });

        this._handleDefaultParams()
        this._handleSelectedDnAutoExpandChange()
        this._handleTimeMachineChange()
        this._handleSelectedDnChange()
        this._handleSelectedAlertsChange()
        this._handleTimelineDataChange()
        this._handleMarkerListChange()
    }

    _handleDefaultParams() {
        const params = new URLSearchParams(window.location.search)

        const fields = this._fieldsSaver.decodeParams(params)

        const { sd, tme, tmdat, tmdt, tmtd, tmdu } = fields

        if (tme) {
            this.sharedState.set('time_machine_enabled', tme === 'true')
        }

        if (tmdat) {
            this.sharedState.set('time_machine_date', tmdat)
        }

        if (tmdt) {
            this.sharedState.set('time_machine_date_to', Date.parse(tmdt))
        } else {
            this.sharedState.set('time_machine_date_to', null);
        }

        if (tmtd) {
            this.sharedState.set('time_machine_target_date', Date.parse(tmtd))
        }

        if (sd) {
            this.sharedState.set('selected_dn', sd)
            this.sharedState.set('auto_pan_to_selected_dn', true);
        }

        if (tmdu) {
            this.sharedState.set('time_machine_duration', tmdu)
        } else {
            this.sharedState.set('time_machine_duration', 12 * 60 * 60)
        }
    }

    _handleSelectedDnAutoExpandChange()
    {
        this.sharedState.subscribe('selected_dn',
            ( selected_dn ) => {
                if (selected_dn) {
                    var dict = this.sharedState.get('diagram_expanded_dns');
                    var parts = splitDn(selected_dn);
                    var dn = parts[0];
                    for(var i = 1; i < parts.length - 1; i++)
                    {
                        dn = dn + '/' + parts[i];
                        dict[dn] = true;
                    }
                    this.sharedState.set('diagram_expanded_dns', dict);
                }
            });
    }

    _handleTimeMachineChange() {
        this.sharedState.subscribe(['time_machine_enabled', 'time_machine_date'],
            ({ time_machine_enabled, time_machine_date }) => {
            console.log('time_machine_enabled', time_machine_enabled)
                if (time_machine_enabled && time_machine_date) {
                    this._service.fetchHistorySnapshot(time_machine_date, (sourceData) => {

                        if (this.sharedState.get('time_machine_enabled') &&
                            (this.sharedState.get('time_machine_date') === time_machine_date ))
                        {
                            this.sharedState.set('diagram_data', sourceData);
                        }
                    })
                }
            })
    }

    _handleSelectedDnChange() {

        this.sharedState.subscribe(['selected_dn', 'time_machine_enabled', 'time_machine_date'],
            ({ selected_dn, time_machine_enabled, time_machine_date }) => {

                if (selected_dn) {
                    if (time_machine_enabled) {
                        this._service.fetchHistoryProps(selected_dn, time_machine_date, (config) => {
                            this.sharedState.set('selected_object_props', config);
                        })

                        this._service.fetchHistoryAlerts(selected_dn, time_machine_date, (config) => {
                            this.sharedState.set('selected_raw_alerts', config);
                        })
                    }
                } else {
                    this.sharedState.set('selected_object_props', null);
                    this.sharedState.set('selected_raw_alerts', null);
                }
            });

    }

    _handleSelectedAlertsChange() {
        this.sharedState.subscribe(['selected_raw_alerts', 'selected_dn'],
            ({selected_raw_alerts, selected_dn}) => {
                if (selected_raw_alerts && selected_dn) {

                    var alerts = _.cloneDeep(selected_raw_alerts);

                    if (_.isPlainObject(alerts))
                    {
                        var newAlerts = [];
                        for(var dn of _.keys(alerts))
                        {
                            for(var alert of alerts[dn])
                            {
                                alert.dn = dn;
                                newAlerts.push(alert);
                            }
                        }
                        alerts = newAlerts
                    }
                    else
                    {
                        for(var alert of alerts)
                        {
                            if (!alert.dn)
                            {
                                alert.dn = selected_dn;
                            }
                        }
                    }

                    alerts = _.orderBy(alerts, ['dn', 'severity', 'msg']);

                    for(var alert of alerts)
                    {
                        alert.uiKey = alert.dn + '-' + alert.severity + '-' + alert.id + '-' + alert.msg;
                    }

                    this.sharedState.set('selected_object_alerts', alerts);
                } else {
                    this.sharedState.set('selected_object_alerts', null);
                }
            });
    }

    _handleTimelineDataChange() {
        this._service.fetchHistoryTimelinePreview(data => {
            const orderedData = _.orderBy(data, ['date'], ['asc']);
            const sampledData = this._resamplePreviewTimelineData(orderedData);
            this.sharedState.set('time_machine_timeline_preview', sampledData);
        })

        this.sharedState.subscribe(['time_machine_duration', 'time_machine_date_to'],
            ({ time_machine_duration, time_machine_date_to }) => {

                var to = time_machine_date_to ? moment(time_machine_date_to) : moment()

                var durationSec = time_machine_duration || 12 * 60 * 60;

                var from =
                    to.clone().subtract(durationSec, 'seconds');

                this._desiredTimelineDateFrom = from;
                this._desiredTimelineDateTo = to;

                this._tryQueryTimelineData();
            }
        )
    }

    _tryQueryTimelineData()
    {
        const from = this._desiredTimelineDateFrom;
        const to = this._desiredTimelineDateTo;

        const fromMoment = moment(from);
        const toMoment = moment(to);

        if ((from === this._latestTimelineDateFrom) && 
            (to === this._latestTimelineDateTo))
        {
            return;
        }

        if (this._latestData)
        {
            let newData = this._latestData.filter(elem => elem.dateMoment.isBetween(fromMoment, toMoment));
            this._setTimelineData(newData, fromMoment, toMoment);
        }

        if (this._isQueryingTimeline) {
            return;
        }
        this._isQueryingTimeline = true;

        this._service.fetchHistoryTimeline(from, to, data => {
            this._isQueryingTimeline = false;

            this._latestTimelineDateFrom = from;
            this._latestTimelineDateTo = to;

            const dates = data.filter(elem => elem.dateMoment.isBetween(fromMoment, toMoment));
            let orderedData = _.orderBy(dates, ['date'], ['asc']);

            this._latestData = orderedData;

            this._setTimelineData(orderedData, fromMoment, toMoment);
        });
    }
    
    _setTimelineData(value, from, to)
    {
        const resampled = this._resampleTimelineData(value, from, to);
        this.sharedState.set('time_machine_timeline_data', resampled);
    }

    _resamplePreviewTimelineData(data)
    {
        if (!data) {
            return [];
        }
        if (!data.length) {
            return [];
        }

        return this._resampleTimelineData(data, 
            moment(_.head(data).date), 
            moment(_.last(data).date))
    }

    _resampleTimelineData(data, from, to)
    {
        if (!data) {
            return [];
        }
        if (!data.length) {
            return [];
        }

        let sampleCount = 200;
        if (data.length <= sampleCount) {
            return data;
        }

        const diff = to.diff(from);
        let period = diff / sampleCount;

        let groups = [];

        let date = to.clone();
        let index = data.length - 1;
        while (date.isSameOrAfter(from))
        {
            const periodStart = date.clone().subtract(period, 'milliseconds');
            const newPoint = {
                dateMoment: date,
                date: date.toISOString(),
                samples: []
            }

            while ((index >= 0) && (data[index].dateMoment.isSameOrAfter(periodStart)))
            {
                newPoint.samples.push(data[index]);
                index--;
            }
            groups.unshift(newPoint);

            date = periodStart;
        }

        const resampled = groups.map(x => this._reduceTimelineGroup(x));

        return resampled;
    }

    _reduceTimelineGroup(group)
    {
        const point = {
            date: group.date,
            dateMoment: moment(group.date),
            changes: 0,
            error: 0,
            warn: 0
        };

        if (group.samples.length > 0)
        {
            point.error = Math.round(_.sum(group.samples.map(x => x.error)) / group.samples.length);
            point.warn = Math.round(_.sum(group.samples.map(x => x.warn))  / group.samples.length);
            point.changes = _.max(group.samples.map(x => x.changes));
        }

        return point;
    }

    _handleMarkerListChange()
    {
        this.sharedState.subscribe('marker_editor_items',
            (marker_editor_items) => {

                var markerDict = {};
                if (marker_editor_items) {
                    markerDict = _.makeDict(marker_editor_items,
                        x => x.name,
                        x => ({
                            shape: x.shape,
                            color: x.color
                        }))
                }

                this.sharedState.set('markers_dict', markerDict);
            });
    }

}

export default StateHandler;
