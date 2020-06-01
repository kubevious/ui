import _ from 'the-lodash'

class StateHandler {
    constructor(state, rootService) {
        this.sharedState = state;
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
        this.sharedState.subscribe(['time_machine_enabled', 'time_machine_date'],
            ({ time_machine_enabled, time_machine_date }) => {
                if (time_machine_enabled) {
                    this._service.fetchHistorySnapshot(time_machine_date, (sourceData) => {
                        this.sharedState.set('diagram_data', sourceData);
                    })

                } else {
                    this._service.fetchDiagram((sourceData) => {
                        this.sharedState.set('diagram_data', sourceData);
                    })
                }

            })
    }

    _handleSelectedObjectChange() {

        this.sharedState.subscribe(['selected_dn', 'time_machine_enabled', 'time_machine_date'],
            ({ selected_dn, time_machine_enabled, time_machine_date }) => {

                if (selected_dn) {
                    if (time_machine_enabled) {
                        this._service.fetchHistoryProperties(selected_dn, time_machine_date, (config) => {
                            this.sharedState.set('selected_object_assets', config);
                        })
                    }
                } else {
                    this.sharedState.set('selected_object_assets', null);
                }
            });

    }

    _handleSelectedObjectAssetsChange() {
        this.sharedState.subscribe('selected_object_assets',
            (selected_object_assets) => {
                console.log('selected_object_assets', selected_object_assets)
                if (selected_object_assets) {
                    this.sharedState.set('selected_object_props', selected_object_assets.props);
                    this.sharedState.set('selected_object_alerts', selected_object_assets.alerts);
                } else {
                    this.sharedState.set('selected_object_props', []);
                    this.sharedState.set('selected_object_alerts', []);
                }
            })
    }

    _handleTimelineDataChange() {
        this.sharedState.subscribe(['time_machine_date_from', 'time_machine_date_to'],
            ({ time_machine_date_from, time_machine_date_to }) => {

                if (!time_machine_date_from || !time_machine_date_to) {
                    this.sharedState.set('time_machine_timeline_data', null);
                    this.sharedState.set('time_machine_actual_date_from', null);
                    this.sharedState.set('time_machine_actual_date_to', null);

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
                    this.sharedState.set('time_machine_timeline_data', orderedData);

                    this.sharedState.set('time_machine_actual_date_from', time_machine_date_from);
                    this.sharedState.set('time_machine_actual_date_to', time_machine_date_to);

                });

            }
        )
    }

}

export default StateHandler;