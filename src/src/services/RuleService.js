import BaseService from './BaseService'

class RuleService extends BaseService {
    constructor(client, sharedState, socket)
    {
        super(client, sharedState, socket)

        this._setupWebSocket();
    }

    backendFetchRuleList(cb) {
        return this._client.get('/rules')
            .then(result => {
                cb(result.data);
            });
    }

    backendFetchRule(id, cb) {
        return this._client.get('/rule/' + id)
            .then(result => {
                cb(result.data);
            });
    }

    backendCreateRule(rule, name, cb) {
        return this._client.post('/rule/' + name, rule)
            .then(result => {
                cb(result.data)
            });
    }

    backendDeleteRule(id, cb) {
        return this._client.delete('/rule/' + id)
            .then(result => {
                cb(result.data);
            });
    }

    backendExportItems(cb) {
        return this._client.get('/rules/export')
            .then(result => {
                cb(result.data);
            });
    }

    backendImportItems(policies, cb) {
        return this._client.post('/rules/import', policies)
            .then(result => {
                cb(result.data);
            });
    }

    _setupWebSocket()
    {
        this.sharedState.set('rule_editor_items', []);

        this._socketSubscribe({ kind: 'rules-statuses' }, value => {
            if (!value) {
                value = [];
            }
            this.sharedState.set('rule_editor_items', value)
        });

        var selectedRuleScope = this._socketScope((value, target) => {

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
}

export default RuleService
