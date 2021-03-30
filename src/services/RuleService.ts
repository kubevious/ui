import _ from 'the-lodash';
import { HttpClient, ISharedState } from '@kubevious/ui-framework';
import { IRuleService, IWebSocketService } from '@kubevious/ui-middleware';

import { BaseService } from './BaseService'

export class RuleService extends BaseService implements IRuleService {

    constructor(client: HttpClient, sharedState: ISharedState, socket: IWebSocketService)
    {
        super(client, sharedState, socket)

        this._setupWebSocket();
    }

    backendFetchRuleList(cb: (data: any) => any) : void {
        this.client.get('/rules')
            .then(result => {
                cb(result.data);
                return null;
            });
    }

    backendFetchRule(id: string, cb: (data: any) => any) : void {
        this.client.get('/rule/' + id)
            .then(result => {
                cb(result.data);
                return null;
            });
    }

    backendCreateRule(config: any, name: string, cb: (data: any) => any) : void {
        this.client.post('/rule/' + name, config)
            .then(result => {
                cb(result.data)
                return null;
            });
    }

    backendDeleteRule(id: string, cb: (data: any) => any) : void {
        this.client.delete('/rule/' + id)
            .then(result => {
                cb(result.data);
                return null;
            });
    }

    backendExportItems(cb: (data: any) => any) : void {
        this.client.get('/rules/export')
            .then(result => {
                cb(result.data);
                return null;
            });
    }

    backendImportItems(rules: any, cb: (data: any) => any) : void {
        this.client.post('/rules/import', rules)
            .then(result => {
                cb(result.data);
                return null;
            });
    }

    private _setupWebSocket()
    {
        this.sharedState.set('rule_editor_items', []);

        this._socketSubscribe({ kind: 'rules-statuses' }, value => {
            if (!value) {
                value = [];
            }
            this.sharedState.set('rule_editor_items', value)
        });

        const selectedRuleScope = this._socketScope((value, target) => {

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
