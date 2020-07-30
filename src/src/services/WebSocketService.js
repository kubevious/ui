import WebSocketSubscriptionClient from 'websocket-subscription-client';
import _ from 'the-lodash'

class WebSocketService
{
    constructor(sharedState)
    {
        this.sharedState = sharedState;
        this._socket = new WebSocketSubscriptionClient('/socket');

        this._socket.run();

        this._setup();
    }

    _setup()
    {
        this._setupAssets();
        this._setupRuleEditor();
        this._setupMarkerEditor();
    }

    _setupAssets()
    {
        var sockerScope = this._socket.scope((value, target) => {
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

                sockerScope.replace(wsSubscriptions);
            })
    }

    _setupRuleEditor()
    {
        this.sharedState.set('rule_editor_items', []);

        this._subscribe({ kind: 'rules-statuses' }, value => {
            if (!value) {
                value = [];
            }
            this.sharedState.set('rule_editor_items', value)
        });

        var selectedRuleScope = this._socket.scope((value, target) => {

            this.sharedState.set('rule_editor_selected_rule_status', value);

        });

        this.sharedState.subscribe('rule_editor_selected_rule_id',
            (rule_editor_selected_rule_id) => {

                selectedRuleScope.replace([
                    { 
                        kind: 'rule-result',
                        name: rule_editor_selected_rule_id
                    }
                ]);

            });
    }

    _setupMarkerEditor()
    {
        this.sharedState.set('marker_editor_items', []);

        this._subscribe({ kind: 'markers-statuses' }, value => {
            if (!value) {
                value = [];
            }
            this.sharedState.set('marker_editor_items', value)
        });

        var selectedMarkerScope = this._socket.scope((value, target) => {

            this.sharedState.set('rule_editor_selected_marker_status', value);

        });

        this.sharedState.subscribe('marker_editor_selected_marker_id',
            (marker_editor_selected_marker_id) => {

                if (marker_editor_selected_marker_id)
                {
                    selectedMarkerScope.replace([
                        { 
                            kind: 'marker-result',
                            name: marker_editor_selected_marker_id
                        }
                    ]);
                }

            });
    }

    _subscribe(target, cb) 
    {
        this._socket.subscribe(target, value => {
            cb(value);
        });
    }

    scope(cb)
    {
        return this._socket.scope(cb);
    }
}

export default WebSocketService;
