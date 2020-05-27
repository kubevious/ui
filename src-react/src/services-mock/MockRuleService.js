import _ from 'lodash'

let MOCK_RULE_LIST = [
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

class MockRuleService {

    constructor(state)
    {
        this._state = state;
        this._notifyRules();
    }

    _notifyRules()
    {
        this.backendFetchRuleList((result) => {
            this._state.set('rule_editor_items', result);
        })
    }

    backendFetchRuleList(cb) {
        var res = MOCK_RULE_LIST.map(x => ({ id: x.id, name: x.name, enabled: x.enabled, error_count: x.id % 3 }));
        cb(res);
    }

    backendFetchRule(id, cb) {
        var res = MOCK_RULE_LIST.find(rule => rule.id === id);
        if (res) {
            res = {
                rule: res,
                items: [
                    {
                        'dn': 'root/ns-[gitlab]/app-[gitlab-gitlab-exporter]/initcont-[configure]/image-[busybox]',
                        'has_error': 1,
                        'has_warning': 0
                    },
                    {
                        'dn': 'root/ns-[gitlab]/app-[gitlab-gitlab-shell]/initcont-[configure]/image-[busybox]',
                        'has_error': 1,
                        'has_warning': 0
                    },
                    {
                        'dn': 'root/ns-[gitlab]/app-[gitlab-minio]/initcont-[configure]/image-[busybox]',
                        'has_error': 1,
                        'has_warning': 0
                    },
                    {
                        'dn': 'root/ns-[gitlab]/app-[gitlab-registry]/initcont-[configure]/image-[busybox]',
                        'has_error': 1,
                        'has_warning': 0
                    },
                    {
                        'dn': 'root/ns-[gitlab]/app-[gitlab-sidekiq-all-in-1]/initcont-[configure]/image-[busybox]',
                        'has_error': 1,
                        'has_warning': 0
                    },
                    {
                        'dn': 'root/ns-[gitlab]/app-[gitlab-task-runner]/initcont-[configure]/image-[busybox]',
                        'has_error': 1,
                        'has_warning': 0
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
                ],
                logs: []
            }

            for (var i = 0; i < res.rule.id % 3; i++) {
                res.logs.push({
                    kind: 'error',
                    msg: {
                        source: (i % 2 === 0) ? ['target'] : ['script'],
                        msg: 'This is error number ' + i
                    }
                });
            }
        }
        cb(res);
    }

    backendCreateRule(rule, cb) {
        rule = _.clone(rule);
        rule.id = _.max(MOCK_RULE_LIST.map(x => x.id)) + 1;
        MOCK_RULE_LIST.push(rule);
        cb(rule);
        this._notifyRules();
    }

    backendDeleteRule(id, cb) {
        MOCK_RULE_LIST = MOCK_RULE_LIST.filter(x => x.id !== id);
        cb();
        this._notifyRules();
    }

    backendUpdateRule(id, config, cb) {
        var rule = _.head(MOCK_RULE_LIST.filter(x => x.id === id));
        if (rule) {
            rule.name = config.name;
            rule.enabled = config.enabled;
            rule.target = config.target;
            rule.script = config.script;
        }
        cb(rule);
        this._notifyRules();
    }

    backendExportRules(cb) {
        var data = _.cloneDeep(MOCK_RULE_LIST);
        for (var x of data) {
            delete x.id;
        }
        cb(data);
    }

    backendImportRules(rules, cb) {
        MOCK_RULE_LIST = _.clone(rules.data);
        cb();
    }
}

export default MockRuleService