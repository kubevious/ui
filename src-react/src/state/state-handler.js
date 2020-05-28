import _ from 'the-lodash'

class StateHandler {
    constructor(state, rootService) {
        this._state = state;
        this._rootService = rootService;
        this._service = rootService.kubevious();
        this._setup();
    }

    close() {

    }

    _setup() {
        this._handleDiagramChange()
        this._handleSelectedObjectChange()
        this._handleSelectedObjectAssetsChange()
        this._handleTimelineDataChange()
    }

    _handleDiagramChange() {
        this._state.subscribe(['time_machine_enabled', 'time_machine_date'],
            ({ time_machine_enabled, time_machine_date }) => {
                if (time_machine_enabled) {
                    this._service.fetchHistorySnapshot(time_machine_date, (sourceData) => {
                        this._state.set('diagram_data', sourceData);
                    })

                } else {
                    this._service.fetchDiagram((sourceData) => {
                        this._state.set('diagram_data', sourceData);
                    })
                }

            })
    }

    _handleSelectedObjectChange() {
        this._state.subscribe(['selected_dn', 'time_machine_enabled', 'time_machine_date'],
            ({ selected_dn, time_machine_enabled, time_machine_date }) => {

                if (selected_dn) {
                    if (time_machine_enabled) {
                        this._service.fetchHistoryProperties(selected_dn, time_machine_date, (config) => {
                            this._state.set('selected_object_assets', config);
                        })
                    } else {
                        this._service.fetchAssets(selected_dn, (config) => {
                            this._state.set('selected_object_assets', config);
                        })
                    }
                } else {
                    this._state.set('selected_object_assets', null);
                }

            })
    }

    _handleSelectedObjectAssetsChange() {
        this._state.subscribe('selected_object_assets',
            (selected_object_assets) => {
                console.log('selected_object_assets', selected_object_assets)
                if (selected_object_assets) {
                    this._state.set('selected_object_props', selected_object_assets.props);
                    this._state.set('selected_object_alerts', selected_object_assets.alerts);
                } else {
                    this._state.set('selected_object_props', []);
                    this._state.set('selected_object_alerts', []);
                }
            })
    }

    _handleTimelineDataChange() {
        this._state.subscribe(['time_machine_date_from', 'time_machine_date_to'],
            ({ time_machine_date_from, time_machine_date_to }) => {

                if (!time_machine_date_from || !time_machine_date_to) {
                    this._state.set('time_machine_timeline_data', null);
                    this._state.set('time_machine_actual_date_from', null);
                    this._state.set('time_machine_actual_date_to', null);

                    return;
                }

                var from = time_machine_date_from.toISOString();
                var to = time_machine_date_to.toISOString();

                this._service.fetchHistoryTimeline(from, to, data => {
                    for(var x of data)
                    {
                        x.date = new Date(x.date);
                    }
                    var orderedData = _.orderBy(data, ['date'], ['asc']);
                    this._state.set('time_machine_timeline_data', orderedData);

                    this._state.set('time_machine_actual_date_from', time_machine_date_from);
                    this._state.set('time_machine_actual_date_to', time_machine_date_to);

                });

            }
        )
    }

}

export default StateHandler;