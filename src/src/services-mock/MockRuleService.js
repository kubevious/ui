import _ from 'the-lodash'
import { MOCK_MARKERS } from './MockMarkerService'

var MOCK_RULES = [
    {
        id: 1,
        enabled: true,
        name: 'rule 1',
        target: 'target-1',
        script: 'script-1'
    },
    {
        id: 2,
        enabled: false,
        name: 'rule 2',
        target: 'target-2',
        script: 'if (item.hasChild("Ingress")) \n { \n \t if (item.config.spec.type == \'ClusterIP\') \n \t{ \n \t\tfail(\'Use ClusterIP for Ingress exposed services\'); \n \t } \n }'
    },
    {
        id: 3,
        enabled: true,
        name: 'rule 3',
        target: 'target-3',
        script: 'script-3'
    },
];
MOCK_RULES = _.makeDict(MOCK_RULES, x => x.name);
for(var x of _.values(MOCK_RULES))
{
    x.items = [];
    x.logs = [];
    x.is_current = (x.id % 2 == 0);
}

class MockRuleService {

    constructor(parent, sharedState)
    {
        this._parent = parent;
        this.sharedState = sharedState;
        this._notifyRules();

        setInterval(() => {
            for(var x of _.values(MOCK_RULES))
            {
                x.is_current = true;
                x.items = [];
                x.logs = [];
            }

            for(var rule of _.values(MOCK_RULES))
            {
                if (rule.enabled)
                {
                    var hasError = (Math.random() * 100 > 60);
                    if (hasError)
                    {
                        rule.logs = [];
                        for (var i = 0; i < rule.id % 3; i++) {
                            rule.logs.push({
                                kind: 'error',
                                msg: {
                                    source: (i % 2 === 0) ? ['target'] : ['script'],
                                    msg: 'This is error number ' + i
                                }
                            });
                        }
                    }
                    else
                    {
                        var dnList = this._parent.diagramService().getRandomDnList();
                        rule.items = dnList.map(x => ({
                            dn: x,
                            has_error: (Math.random() * 10 > 4),
                            has_warning: (Math.random() * 10 > 2),
                            markers: [_.sample(_.values(MOCK_MARKERS).map(x => x.name))]
                        }));
                    }
                }
            }

            this._notifyRules();
            
        }, 5000);

        this.sharedState.subscribe('rule_editor_selected_rule_id',
            (rule_editor_selected_rule_id) => {
                this._notifyRuleStatus(rule_editor_selected_rule_id);
            })
    }

    _notifyRules()
    {
        this.backendFetchRuleList((result) => {
            this.sharedState.set('rule_editor_items', result);
        })

        var id = this.sharedState.get('rule_editor_selected_rule_id');
        if (id) {
            this._notifyRuleStatus(id);
        }
    }

    _notifyRuleStatus(id)
    {
        var rule = MOCK_RULES[id];
        var data = null;
        if (rule) {
            data = {
                id: id,
                is_current: rule.is_current,
                error_count: rule.logs.length,
                item_count: rule.items.length
            }
            data.items = rule.items; 
            data.logs = rule.logs;
        }
        this.sharedState.set('rule_editor_selected_rule_status', data);
    }

    _makeRuleListItem(x)
    {
        if (!x) {
            return null;
        }
        return {
            id: x.id,
            name: x.name,
            enabled: x.enabled,
            item_count: x.items.length,
            error_count: x.logs.length,
            is_current : x.is_current
        }
    }

    _makeRuleItem(x)
    {
        var item = this._makeRuleListItem(x);
        if (!item) {
            return null;
        }
        item.script = x.script;
        item.target = x.target;
        item.enabled = x.enabled;
        return item;
    }

    backendFetchRuleList(cb) {
        var list = _.values(MOCK_RULES);
        list = list.map(x => this._makeRuleListItem(x));
        setTimeout(() => {
            cb(list);
        }, 100);
    }

    backendFetchRule(name, cb) {
        var item = MOCK_RULES[name];
        item = this._makeRuleItem(item);
        setTimeout(() => {
            cb(item);
        }, 500);
    }

    backendCreateRule(rule, name, cb) {
        rule = _.clone({ ...rule, items: [], logs: [] });

        if (MOCK_RULES[name]) {
            this.backendUpdateRule(rule, name, cb)
            return
        }

        MOCK_RULES[rule.name] = rule

        cb(rule);
        this._notifyRules();
    }

    backendUpdateRule(rule, name, cb) {
        MOCK_RULES[name] = _.clone({ ...rule, items: [], logs: [] });

        for (var key in MOCK_RULES) {
            if (key === name) {
                key = rule.name
            }
        }

        cb(rule)
        this._notifyRules();
    }

    backendDeleteRule(id, cb) {
        delete MOCK_RULES[id];
        cb();
        this._notifyRules();
    }

    backendExportItems(cb) {
        var data = _.cloneDeep(_.values(MOCK_RULES));
        for (var x of data) {
            delete x.id;
        }
        cb(data);
    }

    backendImportRules(rules, cb) {
        let max = _.max(_.values(MOCK_RULES).map(x => x.id))
        MOCK_RULES = {};
        for(var x of rules.data)
        {
            x.id = max + 1;
            max = x.id
            x.items = []
            x.logs = []
            MOCK_RULES[x.id] = x;
        }
        cb();
        this._notifyRules();
    }
}

export default MockRuleService
