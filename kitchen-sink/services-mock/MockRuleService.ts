import _ from "the-lodash"
import { MOCK_MARKERS } from "./MockMarkerService"
import { MockRootApiService } from "./MockRootApiService"

import { RemoteTrack } from "@kubevious/ui-framework/dist/remote-track"
import { ISharedState } from "@kubevious/ui-framework"

import { getRandomDnList } from "./utils"

import { IRuleService } from "@kubevious/ui-middleware"

let MOCK_RULES_ARRAY = [
    {
        enabled: true,
        name: "rule 1",
        target: "target-1",
        script: "script-1",
    },
    {
        enabled: false,
        name: "rule 2",
        target: "target-2",
        script:
            "if (item.hasChild(\"Ingress\")) \n { \n \t if (item.config.spec.type == 'ClusterIP') \n \t{ \n \t\tfail('Use ClusterIP for Ingress exposed services'); \n \t } \n }",
    },
    {
        enabled: true,
        name: "rule 3",
        target: "target-3",
        script: "script-3",
    },
]
let MOCK_RULES = _.makeDict(MOCK_RULES_ARRAY, (x) => x.name, x => x)
for (const x of _.values(MOCK_RULES)) {
    x.items = []
    x.logs = []
    x.is_current = (Math.random() * 10) % 2 === 0
}

export class MockRuleService implements IRuleService {
    private parent: MockRootApiService
    private sharedState: ISharedState
    private _remoteTrack: RemoteTrack

    constructor(parent: MockRootApiService, sharedState: ISharedState) {
        this.parent = parent
        this.sharedState = sharedState
        this._remoteTrack = new RemoteTrack(sharedState)

        this._notifyRules()

        setInterval(() => {
            for (const x of _.values(MOCK_RULES)) {
                x.is_current = true
                x.items = []
                x.logs = []
            }

            for (const rule of _.values(MOCK_RULES)) {
                if (rule.enabled) {
                    const hasError = Math.random() * 100 > 60
                    if (hasError) {
                        rule.logs = []
                        for (let i = 0; i < (Math.random() * 10) % 3; i++) {
                            rule.logs.push({
                                kind: "error",
                                msg: {
                                    source:
                                        i % 2 === 0 ? ["target"] : ["script"],
                                    msg: "This is error number " + i,
                                },
                            })
                        }
                    } else {
                        const dnList = getRandomDnList()
                        rule.items = dnList.map((x) => ({
                            dn: x,
                            id: Math.floor(Math.random() * 10),
                            errors: Math.floor(Math.random() * 10),
                            warnings: Math.floor(Math.random() * 10),
                            markers: [
                                _.sample(
                                    _.values(MOCK_MARKERS).map((x) => x.name)
                                ),
                            ],
                        }))
                    }
                }
            }

            this._notifyRules()
        }, 5000)

        this.sharedState.subscribe(
            "rule_editor_selected_rule_id",
            (rule_editor_selected_rule_id) => {
                this._notifyRuleStatus(rule_editor_selected_rule_id)
            }
        )
    }

    close() {}

    private _notifyRules() {
        const id = new Date().toISOString();
        this._remoteTrack.start({
            id: id,
            method: 'GET',
            url: '/',
            headers: {}
        })

        this.backendFetchRuleList((result) => {
            this.sharedState.set("rule_editor_items", result)
        })

        const name = this.sharedState.get("rule_editor_selected_rule_id")
        if (name) {
            this._notifyRuleStatus(name)
        }

        setTimeout(() => {
            this._remoteTrack.finish({
                id: id,
                method: 'GET',
                url: '/',
                headers: {}
            }, {});
        }, 1000)
    }

    private _notifyRuleStatus(name: string) {
        const rule: any = MOCK_RULES[name]
        let data: any = null
        if (rule) {
            data = {
                name: rule.name,
                is_current: rule.is_current,
                error_count: rule.logs.length,
            }
            data.items = rule.items
            data.logs = rule.logs
        }
        this.sharedState.set("rule_editor_selected_rule_status", data)
    }

    private _makeRuleListItem(x) {
        if (!x) {
            return null
        }
        return {
            name: x.name,
            enabled: x.enabled,
            item_count: x.items.length,
            error_count: x.logs.length,
            is_current: x.is_current,
        }
    }

    private _makeRuleItem(x) {
        const item: any = this._makeRuleListItem(x)
        if (!item) {
            return null
        }
        item.script = x.script
        item.target = x.target
        item.enabled = x.enabled
        return item
    }

    backendFetchRuleList(cb: (data: any) => any): void {
        let list = _.values(MOCK_RULES)
        list = list.map((x) => this._makeRuleListItem(x))
        setTimeout(() => {
            cb(list)
        }, 100)
    }

    backendFetchRule(name: string, cb: (data: any) => any): void {
        const item = MOCK_RULES[name]
        let ruleItem = this._makeRuleItem(item)
        setTimeout(() => {
            cb(ruleItem)
        }, 500)
    }

    backendCreateRule(rule: any, name: string, cb: (data: any) => any): void {
        rule = _.clone({ ...rule, items: [], logs: [] })

        if (MOCK_RULES[name]) {
            this._backendUpdateRule(rule, name, cb)
            return
        }

        MOCK_RULES[rule.name] = rule

        cb(rule)
        this._notifyRules()
    }

    _backendUpdateRule(rule, name, cb) {
        MOCK_RULES[rule.name] = _.clone({ ...rule, items: [], logs: [] })

        delete MOCK_RULES[name]

        cb(rule)
        this._notifyRules()
    }

    backendDeleteRule(id: string, cb: (data: any) => any): void {
        delete MOCK_RULES[id]
        cb({})
        this._notifyRules()
    }

    backendExportItems(cb: (data: any) => any): void {
        const data = {
            kind: "rules",
            items: _.cloneDeep(_.values(MOCK_RULES)),
        }
        cb(data)
    }

    backendImportItems(rules: any, cb: (data: any) => any): void {
        if (rules.deleteExtra) {
            MOCK_RULES = []
        }

        for (const x of rules.data.items) {
            x.items = []
            x.logs = []
            MOCK_RULES[x.name] = x
        }

        cb({})
        this._notifyRules()
    }
}
