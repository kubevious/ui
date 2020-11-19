import _ from 'the-lodash'
import { splitDn } from '../utils/naming-utils'
import FieldsSaver from '../utils/save-fields';
import moment from 'moment'
import TimelineUtils from '../utils/timeline-utils'

class StateHandler {
    constructor(sharedState, diagramService) {
        if (!sharedState) {
            throw new Error("SharedState not provided");
        }
        if (!diagramService) {
            throw new Error("DiagramService not provided");
        }

        this._timelineUtils = new TimelineUtils(sharedState);

        this._isTimeMachineDateSetScheduled = false;
        this._isTimeMachineDateDirty = false;

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

        this.sharedState.set('time_machine_timeline_preview', []);

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

        const { sd, tme, tmtd, tmdt, tmd } = fields

        if (sd) {
            this.sharedState.set('selected_dn', sd)
            this.sharedState.set('auto_pan_to_selected_dn', true);
        }

        if (tme) {
            this.sharedState.set('time_machine_enabled', tme === 'true')
        }

        if (tmtd) {
            this.sharedState.set('time_machine_target_date', Date.parse(tmtd))
        }

        if (tmdt) {
            this.sharedState.set('time_machine_date_to', Date.parse(tmdt))
        } else {
            this.sharedState.set('time_machine_date_to', null);
        }

        if (tmd) {
            this.sharedState.set('time_machine_duration', tmd)
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
        this.sharedState.subscribe(['time_machine_target_date'],
            () => {

                if (this._isTimeMachineDateSetScheduled) {
                    this._isTimeMachineDateDirty = true;
                    return;
                }

                this._triggerTimeMachine();
            })

        this.sharedState.subscribe(['time_machine_enabled', 'time_machine_date'],
            ({ time_machine_enabled, time_machine_date }) => {
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

    _triggerTimeMachine()
    {
        this._isTimeMachineDateDirty = false;

        setTimeout(() => {
            const value = this.sharedState.get('time_machine_target_date');
            this.sharedState.set('time_machine_date', value);

            this._isTimeMachineDateSetScheduled = false;
            if (this._isTimeMachineDateDirty) {
                this._triggerTimeMachine();
            }

        }, 250);
    }

    _handleSelectedDnChange() {

        this.sharedState.subscribe(['selected_dn', 'time_machine_enabled', 'time_machine_date'],
            ({ selected_dn, time_machine_enabled, time_machine_date }) => {

                if (selected_dn) {
                    if (time_machine_enabled && time_machine_date) {
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

    _massageTimelineData(data)
    {
        if (!data || data.length === 0)
        {
            let date = moment();
            return [{
                date: date.toISOString(),
                dateMoment: date,
                error: 0,
                warn: 0,
                changes: 0
            }];
        }

        for(let x of data)
        {
            x.dateMoment = moment(x.date);
        }

        return data;
    }

    _handleTimelineDataChange() {

        this._service.subscribeTimelinePreview(data => {
            this.sharedState.set('time_machine_timeline_preview_raw', data);
        })

        this.sharedState.subscribe('time_machine_timeline_preview_raw', 
            time_machine_timeline_preview_raw => 
            {
                const massagedData = this._massageTimelineData(time_machine_timeline_preview_raw);
                const lastDate = _.last(massagedData).dateMoment;

                this.sharedState.set('time_machine_timeline_preview', massagedData);
                this.sharedState.set('time_machine_timeline_preview_last_date', lastDate);
            }
        );

        this.sharedState.subscribe([
            'time_machine_duration',
            'time_machine_date_to',
            'time_machine_timeline_preview_last_date'
            ],
            () => {
                let actual = this._timelineUtils.getActualRange();
               
                this.sharedState.set('time_machine_actual_date_to', actual.to);
                this.sharedState.set('time_machine_actual_date_from', actual.from);
            }
        )

        this.sharedState.subscribe(['time_machine_actual_date_from', 'time_machine_actual_date_to'],
            ({ time_machine_actual_date_from, time_machine_actual_date_to }) => {

                this._desiredTimelineDateFrom = time_machine_actual_date_from;
                this._desiredTimelineDateTo = time_machine_actual_date_to;

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

        if (this._isQueryingTimeline) {
            return;
        }
        this._isQueryingTimeline = true;

        this._service.fetchHistoryTimeline(from, to, data => {
            this._isQueryingTimeline = false;

            this._latestTimelineDateFrom = from;
            this._latestTimelineDateTo = to;

            const massagedData = this._massageTimelineData(data);
            this.sharedState.set('time_machine_timeline_data', massagedData);

            this._tryQueryTimelineData();
        });
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
