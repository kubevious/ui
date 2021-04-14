import _ from "the-lodash"
import { Promise } from 'the-promise'
import { MOCK_MARKERS } from "./MockMarkerService"
import { MockRootApiService } from "./MockRootApiService"

import { RemoteTrack } from "@kubevious/ui-framework/dist/remote-track"
import { ISharedState } from "@kubevious/ui-framework"

import { getRandomDnList } from "./utils"

import { IRuleService } from "@kubevious/ui-middleware"
import { RuleConfig, RuleListItem, RuleResult, RulesExportData, RulesImportData, RuleStatus } from "@kubevious/ui-middleware/dist/services/rule"

let MOCK_RULES_ARRAY: any = [
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
let MOCK_RULES = _.makeDict(
    MOCK_RULES_ARRAY,
    (x) => x.name,
    (x) => x
)
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

    getRulesStatuses(): Promise<RuleStatus[]> {
        throw new Error("Method not implemented.")
    }

    getRuleResult(name: string): Promise<RuleResult> {
        throw new Error("Method not implemented.")
    }

    close()
    {

    }

    subscribeRuleStatuses(cb: ((items: RuleStatus[]) => void)) : void
    {
        // TODO: FIX THIS
        this.getRuleList()
            .then((result) => {
                cb(result as RuleStatus[])
            })
    }

    subscribeRuleResult(cb: ((result: RuleResult) => void))
    {
        return {
            update: (ruleName : string) => {
            },
            close: () => {
            }
        }
    }

    private _notifyRules() {
        // const id = new Date().toISOString()
        // this._remoteTrack.start({
        //     id: id,
        //     method: "GET",
        //     url: "/",
        //     headers: {},
        // })

        // this.backendFetchRuleList((result) => {
        //     this.sharedState.set("rule_editor_items", result)
        // })

        // const name = this.sharedState.get("rule_editor_selected_rule_id")
        // if (name) {
        //     this._notifyRuleStatus(name)
        // }

        // setTimeout(() => {
        //     this._remoteTrack.finish(
        //         {
        //             id: id,
        //             method: "GET",
        //             url: "/",
        //             headers: {},
        //         },
        //         {}
        //     )
        // }, 1000)
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

    getRuleList() : Promise<RuleListItem[]> {
        let list = _.values(MOCK_RULES)
        list = list.map((x) => this._makeRuleListItem(x))
        return Promise.timeout(100)
            .then(() => list);
    }

    getRule(name: string) : Promise<RuleConfig | null> {
        const item = MOCK_RULES[name]
        let ruleItem = this._makeRuleItem(item)
        return Promise.timeout(500)
            .then(() => ruleItem);
    }

    createRule(config: RuleConfig, name: string) : Promise<RuleConfig> {
        let rule = _.clone({ ...config, items: [], logs: [] })

        if (name != config.name) {
            delete MOCK_RULES[name];
        }

        MOCK_RULES[rule.name] = rule

        this._notifyRules()

        return Promise.resolve(config);
    }

    deleteRule(name: string) : Promise<void> {
        delete MOCK_RULES[name]
        this._notifyRules()
        return Promise.resolve();
    }

    exportRules() : Promise<RulesExportData> {
        const data : RulesExportData = {
            kind: "rules",
            items: _.cloneDeep(_.values(MOCK_RULES)),
        }
        return Promise.resolve(data);
    }

    importRules(data: RulesImportData) : Promise<void> {
        if (data.deleteExtra) {
            MOCK_RULES = []
        }

        for (const x of data.data.items) {
            MOCK_RULES[x.name] = {
                enabled: x.name,
                name: x.name,
                target: x.target,
                script: x.script,
                items: [],
                logs: [],
                is_current: false,
            }
        }

        this._notifyRules()

        return Promise.resolve();
    }
}
