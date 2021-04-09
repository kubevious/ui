import _ from 'the-lodash';
import { IRuleService } from '@kubevious/ui-middleware';

import { BaseService } from './BaseService'
import { RuleResult, RuleStatus } from '@kubevious/ui-middleware/dist/services/rule';

export class RuleService extends BaseService implements IRuleService {


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
        this.client.post('/rule/' + name, {}, config)
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
        this.client.post('/rules/import', {}, rules)
            .then(result => {
                cb(result.data);
                return null;
            });
    }

    subscribeRuleStatuses(cb: ((items: RuleStatus[]) => void)) : void
    {
        cb([]);

        this._socketSubscribe({ kind: 'rules-statuses' }, value => {
            if (!value) {
                value = [];
            }
            cb(value);
        });
    }

    subscribeRuleResult(cb: ((result: RuleResult) => void))
    {
        const socketScope = this._socketScope((value, target) => {
            cb(value);
        });

        return {
            update: (ruleName : string) => {
                socketScope.replace([
                    { 
                        kind: 'rule-result',
                        name: ruleName
                    }
                ]);
            },
            close: () => {
                socketScope.close();
            }
        }
    }

}
