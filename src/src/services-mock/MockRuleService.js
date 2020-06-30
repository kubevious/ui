import _ from 'the-lodash'
import { MOCK_MARKERS } from './MockMarkerService'
import RemoteTrack from '../utils/remote-track';

var MOCK_RULES = [
    {
        enabled: true,
        name: 'rule 1',
        target: 'target-1',
        script: 'script-1'
    },
    {
        enabled: false,
        name: 'rule 2',
        target: 'target-2',
        script: 'if (item.hasChild("Ingress")) \n { \n \t if (item.config.spec.type == \'ClusterIP\') \n \t{ \n \t\tfail(\'Use ClusterIP for Ingress exposed services\'); \n \t } \n }'
    },
    {
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
    x.is_current = (Math.random() * 10 % 2 === 0);
}

class MockRuleService {

    constructor(parent, sharedState)
    {
        this._parent = parent;
        this.sharedState = sharedState;
        this._remoteTrack = new RemoteTrack(sharedState)
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
                        for (var i = 0; i < Math.random() * 10 % 3; i++) {
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
                            id: Math.floor(Math.random() * 10),
                            errors: Math.floor(Math.random() * 10),
                            warnings: Math.floor(Math.random() * 10),
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
        const operation = this._remoteTrack.start({
            action: `notifyRules`
        })

        this.backendFetchRuleList((result) => {
            this.sharedState.set('rule_editor_items', result);
        })

        console.log('rule_editor_selected_rule_id', this.sharedState.get('rule_editor_selected_rule_id'))
        var name = this.sharedState.get('rule_editor_selected_rule_id');
        if (name) {
            this._notifyRuleStatus(name);
        }

        setTimeout(() => {
            operation.complete()
        }, 1000)
    }

    _notifyRuleStatus(name)
    {
        var rule = MOCK_RULES[name];
        var data = null;
        if (rule) {
            data = {
                name: rule.name,
                is_current: rule.is_current,
                error_count: rule.logs.length,
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
        MOCK_RULES[rule.name] = _.clone({ ...rule, items: [], logs: [] });

        delete MOCK_RULES[name]

        cb(rule)
        this._notifyRules();
    }

    backendDeleteRule(name, cb) {
        delete MOCK_RULES[name];
        cb();
        this._notifyRules();
    }

    backendExportItems(cb) {
        var data = {
            kind: 'rules',
            items: _.cloneDeep(_.values(MOCK_RULES))
        }
        cb(data);
    }

    backendImportRules(rules, cb) {
        MOCK_RULES = {};
        for(var x of rules.data.items)
        {
            x.items = []
            x.logs = []
            MOCK_RULES[x.name] = x;
        }
        cb();
        this._notifyRules();
    }
}

export default MockRuleService
