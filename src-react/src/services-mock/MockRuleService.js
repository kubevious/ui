import _ from 'the-lodash'

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
const MOCK_RULE_EDITOR_ITEMS = [
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-gitlab-exporter]/initcont-[configure]/image-[busybox]',
        'has_error': 1,
        'has_warning': 0
    },
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-gitlab-shell]/initcont-[configure]/image-[busybox]',
        'has_error': 1,
        'has_warning': 1
    },
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-minio]/initcont-[configure]/image-[busybox]',
        'has_error': 0,
        'has_warning': 1
    },
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-registry]/initcont-[configure]/image-[busybox]',
        'has_error': 1,
        'has_warning': 0
    },
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-sidekiq-all-in-1]/initcont-[configure]/image-[busybox]',
        'has_error': 1,
        'has_warning': 1
    },
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-task-runner]/initcont-[configure]/image-[busybox]',
        'has_error': 0,
        'has_warning': 1
    },
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-unicorn]/initcont-[configure]/image-[busybox]',
        'has_error': 1,
        'has_warning': 0
    },
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-gitaly]/initcont-[configure]/image-[busybox]',
        'has_error': 1,
        'has_warning': 0
    },
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-redis-server]/initcont-[configure]/image-[busybox]',
        'has_error': 1,
        'has_warning': 0
    },
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-migrations.1]/initcont-[configure]/image-[busybox]',
        'has_error': 1,
        'has_warning': 0
    },
    {
        'dn': 'root/ns-[sock-shop]/app-[carts-db]/cont-[carts-db]/image-[mongo]',
        'has_error': 1,
        'has_warning': 0
    },
    {
        'dn': 'root/ns-[sock-shop]/app-[orders-db]/cont-[orders-db]/image-[mongo]',
        'has_error': 1,
        'has_warning': 0
    }
];
MOCK_RULES = _.makeDict(MOCK_RULES, x => x.id);
for(var x of _.values(MOCK_RULES))
{
    x.items = [];
    x.logs = [];
    x.isCurrent = (x.id % 2 == 0);
}

class MockRuleService {

    constructor(sharedState)
    {
        this.sharedState = sharedState;
        this._notifyRules();

        setInterval(() => {
            for(var x of _.values(MOCK_RULES))
            {
                x.isCurrent = true;
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
                        var count = Math.floor(Math.random() * _.values(MOCK_RULE_EDITOR_ITEMS).length);
                        rule.items = _.take(MOCK_RULE_EDITOR_ITEMS, count);
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
                status: {
                    isCurrent: rule.isCurrent,
                    error_count: rule.logs.length,
                    item_count: rule.items.length
                }
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
            isCurrent : x.isCurrent
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

    backendFetchRule(id, cb) {
        var item = MOCK_RULES[id];
        item = this._makeRuleItem(item);
        setTimeout(() => {
            cb(item);
        }, 500);
    }

    backendCreateRule(rule, cb) {
        rule = _.clone({ ...rule, items: [], logs: [] });
        rule.id = _.max(_.values(MOCK_RULES).map(x => x.id)) + 1;
        MOCK_RULES[rule.id] = rule;
        cb(rule);
        this._notifyRules();
    }

    backendDeleteRule(id, cb) {
        delete MOCK_RULES[id];
        cb();
        this._notifyRules();
    }

    backendUpdateRule(id, config, cb) {
        var rule = MOCK_RULES[id];
        if (rule) {
            rule.name = config.name;
            rule.enabled = config.enabled;
            rule.target = config.target;
            rule.script = config.script;
            rule.isCurrent = false;
        }
        cb(rule);
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