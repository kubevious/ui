import WebSocketSubscriptionClient from 'websocket-subscription-client';

class WebSocketService
{
    constructor(state)
    {
        this._state = state;
        this._socket = new WebSocketSubscriptionClient('/socket');

        this._socket.run();

        this._setup();
    }

    _setup()
    {
        this._state.set('rule_editor_items', []);

        this._subscribe({ kind: 'rules' }, value => {
            if (!value) {
                value = [];
            }
            this._state.set('rule_editor_items', value)
        });

        var selectedRuleScope = this._socket.scope((value, target) => {

            console.log("SCOPE UPDATE. VALUE: " + 
                JSON.stringify(value) + 
                " :: " + 
                JSON.stringify(target)
            );

            this._state.set('rule_editor_selected_rule_status', value);

        });

        this._state.subscribe('rule_editor_selected_rule_id',
            (rule_editor_selected_rule_id) => {

                selectedRuleScope.replace([
                    { 
                        kind: 'rule-status',
                        id: rule_editor_selected_rule_id
                    }
                ]);

            });
    }

    _subscribe(target, cb) 
    {
        this._socket.subscribe(target, value => {
            cb(value);
        });
    }
}

export default WebSocketService;