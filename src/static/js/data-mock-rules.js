
var MOCK_RULE_LIST = [
    {
        id: 1,
        enabled: true,
        name: 'policy 1',
        target: 'target-1',
        script: 'script-1'
    },
    {
        id: 2,
        enabled: false,
        name: 'policy 2',
        target: 'target-2',
        script: 'if (item.hasChild("Ingress")) \n { \n \t if (item.config.spec.type == \'ClusterIP\') \n \t{ \n \t\tfail(\'Use ClusterIP for Ingress exposed services\'); \n \t } \n }'
    },
    {
        id: 3,
        enabled: true,
        name: 'policy 3',
        target: 'target-3',
        script: 'script-3'
    },
];
function backendFetchRuleList(cb) {
    Logger.info("[backendFetchRuleList] ");
    var res = MOCK_RULE_LIST.map(x => ({ 
        id: x.id, 
        name: x.name, 
        enabled: x.enabled, 
        isCurrent: (x.id % 2 == 0),
        error_count: x.id % 3, 
        item_count: 12 
    }));
    cb(res);
}

function backendFetchRule(id, cb) {
    Logger.info("[backendFetchRule] ");
    var rule = MOCK_RULE_LIST.find(policy => policy.id === id);
    var result = null;
    if (rule)
    {
        result = {
            rule: rule,
            items: [
                {
                    "dn": "root/ns-[gitlab]/app-[gitlab-gitlab-exporter]/initcont-[configure]/image-[busybox]",
                    "has_error": 1,
                    "has_warning": 0
                },
                {
                    "dn": "root/ns-[gitlab]/app-[gitlab-gitlab-shell]/initcont-[configure]/image-[busybox]",
                    "has_error": 1,
                    "has_warning": 0
                },
                {
                    "dn": "root/ns-[gitlab]/app-[gitlab-minio]/initcont-[configure]/image-[busybox]",
                    "has_error": 1,
                    "has_warning": 0
                },
                {
                    "dn": "root/ns-[gitlab]/app-[gitlab-registry]/initcont-[configure]/image-[busybox]",
                    "has_error": 1,
                    "has_warning": 0
                },
                {
                    "dn": "root/ns-[gitlab]/app-[gitlab-sidekiq-all-in-1]/initcont-[configure]/image-[busybox]",
                    "has_error": 1,
                    "has_warning": 0
                },
                {
                    "dn": "root/ns-[gitlab]/app-[gitlab-task-runner]/initcont-[configure]/image-[busybox]",
                    "has_error": 1,
                    "has_warning": 0
                },
                {
                    "dn": "root/ns-[gitlab]/app-[gitlab-unicorn]/initcont-[configure]/image-[busybox]",
                    "has_error": 1,
                    "has_warning": 0
                },
                {
                    "dn": "root/ns-[gitlab]/app-[gitlab-gitaly]/initcont-[configure]/image-[busybox]",
                    "has_error": 1,
                    "has_warning": 0
                },
                {
                    "dn": "root/ns-[gitlab]/app-[gitlab-redis-server]/initcont-[configure]/image-[busybox]",
                    "has_error": 1,
                    "has_warning": 0
                },
                {
                    "dn": "root/ns-[gitlab]/app-[gitlab-migrations.1]/initcont-[configure]/image-[busybox]",
                    "has_error": 1,
                    "has_warning": 0
                },
                {
                    "dn": "root/ns-[sock-shop]/app-[carts-db]/cont-[carts-db]/image-[mongo]",
                    "has_error": 1,
                    "has_warning": 0
                },
                {
                    "dn": "root/ns-[sock-shop]/app-[orders-db]/cont-[orders-db]/image-[mongo]",
                    "has_error": 1,
                    "has_warning": 0
                }
            ],
            logs: []
        }

        for(var i = 0; i < rule.id % 3; i++)
        {
            result.logs.push({
                kind: 'error',
                msg: {
                    source: (i % 2 == 0) ? ['target'] : ['script'],
                    msg: 'This is error number ' + i
                }
            });
        }

        rule.isCurrent = (rule.id % 2 == 0);
        rule.item_count = result.items.length;
        rule.error_count = result.logs.length;
    }
    cb(result);
}

function backendCreateRule(policy, cb) {
    Logger.info("[backendCreateRule] ", policy);
    policy = _.clone(policy);
    policy.id = _.max(MOCK_RULE_LIST.map(x => x.id)) + 1;
    MOCK_RULE_LIST.push(policy);
    cb(policy);
}
function backendDeleteRule(id, cb) {
    Logger.info("[backendDeleteRule] %s", id);
    MOCK_RULE_LIST = MOCK_RULE_LIST.filter(x => x.id != id);
    cb();
}
function backendUpdateRule(id, config, cb) {
    Logger.info("[backendUpdatePolicy] %s", id, config);
    var policy = _.head(MOCK_RULE_LIST.filter(x => x.id == id));
    if (policy) {
        policy.name = config.name;
        policy.enabled = config.enabled;
        policy.target = config.target;
        policy.script = config.script;
        policy.isCurrent = false;
    }
    backendFetchRule(id, cb);
}

function backendExportRules(cb) {
    var data = _.cloneDeep(MOCK_RULE_LIST);
    for(var x of data)
    {
        delete x.id;
    }
    cb(data);
}

function backendImportRules(policies, cb) {
    MOCK_RULE_LIST = _.clone(policies.data);
    for(var i = 0; i < MOCK_RULE_LIST.length; i++)
    {
        MOCK_RULE_LIST[i].id = i + 1;
    }
    cb();
}