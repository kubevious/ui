import _ from 'the-lodash';
import { IRuleService } from '@kubevious/ui-middleware';

import { BaseService } from './BaseService'
import { RuleConfig, RuleListItem, RuleResult, RulesExportData, RulesImportData, RuleStatus } from '@kubevious/ui-middleware/dist/services/rule';

export class RuleService extends BaseService implements IRuleService {
    
    getRuleList(): Promise<RuleListItem[]> {
        return this.client.get<RuleListItem[]>('/rules')
            .then(result => result.data);
    }

    getRule(name: string): Promise<RuleConfig | null> {
        return this.client.get<RuleConfig | null>(`/rule/${name}`)
            .then(result => result.data);
    }

    createRule(config: RuleConfig, name: string): Promise<RuleConfig> {
        return this.client.post<RuleConfig>(`/rule/${name}`, {}, config)
            .then(result => result.data);
    }

    deleteRule(name: string): Promise<void> {
        return this.client.delete(`/rule/${name}`)
            .then(() => { });
    }

    exportRules(): Promise<RulesExportData> {
        return this.client.get<RulesExportData>('/rules/export')
            .then(result => result.data);
    }

    importRules(data: RulesImportData): Promise<void> {
        return this.client.post<void>('/rules/import', {}, data)
            .then(result => {});
    }

    getRulesStatuses(): Promise<RuleStatus[]> {
        return this.client.get<RuleStatus[]>('/rules-statuses')
            .then(result => result.data);
    }

    getRuleResult(name: string): Promise<RuleResult> {
        return this.client.get<RuleResult>(`/rules-result/${name}`)
            .then(result => result.data);
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
