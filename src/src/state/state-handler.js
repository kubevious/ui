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

        const { sd, tme, tmdat, tmdt, tmdf, tmtd, tmdu } = fields

        if (tme) {
            this.sharedState.set('time_machine_enabled', tme === 'true')
        }

        if (tmdat) {
            this.sharedState.set('time_machine_date', tmdat)
        }

        if (tmdt) {
            this.sharedState.set('time_machine_date_to', Date.parse(tmdt))
        }

        if (tmdf) {
            this.sharedState.set('time_machine_date_from', Date.parse(tmdf))
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
                    this.sharedState.set('diagram_expanded_dns', dict, { skipCompare: true });
                }
            });
    }

    _handleTimeMachineChange() {
        this.sharedState.subscribe(['time_machine_enabled', 'time_machine_date'],
            ({ time_machine_enabled, time_machine_date }) => {
            console.log('time_machine_enabled', time_machine_enabled)
                if (time_machine_enabled) {
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
            var orderedData = _.orderBy(data, ['date'], ['asc']);
            this.sharedState.set('time_machine_timeline_preview', orderedData);
        })
        this.sharedState.subscribe(['time_machine_date_from', 'time_machine_date_to'],
            ({ time_machine_date_from, time_machine_date_to }) => {

                if (!time_machine_date_from || !time_machine_date_to) {
                    // this.sharedState.set('time_machine_timeline_data', null);
                    this.sharedState.set('time_machine_actual_date_from', null);
                    this.sharedState.set('time_machine_actual_date_to', null);

                    return;
                }

                var from = time_machine_date_from ? new Date(time_machine_date_from) : moment().subtract(1, 'days')
                var to = time_machine_date_to ? new Date(time_machine_date_to) : moment()

                this._service.fetchHistoryTimeline(from, to, data => {
                    const dates = data.filter(elem => moment(elem.date).isSameOrAfter(from) && moment(elem.date).isSameOrBefore(to))
                    var orderedData = _.orderBy(dates, ['date'], ['asc']);
                    this.sharedState.set('time_machine_timeline_data', orderedData);

                    this.sharedState.set('time_machine_actual_date_from', time_machine_date_from);
                    this.sharedState.set('time_machine_actual_date_to', time_machine_date_to);

                });

            }
        )
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
