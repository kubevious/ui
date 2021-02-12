import React from "react"
import { BaseComponent } from "@kubevious/ui-framework"
import { Editor } from "./Editor.jsx"
import "./styles.scss"
import { IRuleService } from "@kubevious/ui-middleware"
import { ItemsList } from "./ItemsList"
import { RuleItem, SelectedItemData } from "./types.js"

const selectedItemInit = {}
const selectedItemDataInit = {
    is_current: true,
    item_count: 0,
    logs: [],
    items: [],
}

type RuleEditorState = {
    selectedTab: string
    items: RuleItem[]
    selectedItemData: SelectedItemData
    selectedItem: RuleItem
    selectedItemId: string
    isSuccess: boolean
    isNewItem: boolean
}

export class RuleEditor extends BaseComponent<IRuleService> {
    private _ruleService: IRuleService
    constructor(props) {
        super(props, { kind: "rule" })

        this.state = {
            selectedTab: "main",
            items: [],
            selectedItem: selectedItemInit,
            selectedItemData: selectedItemDataInit,
            isSuccess: false,
        }
        this._ruleService = this.service as IRuleService

        this.openSummary = this.openSummary.bind(this)
        this.saveItem = this.saveItem.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.createItem = this.createItem.bind(this)
        this.selectItem = this.selectItem.bind(this)
        this.createNewItem = this.createNewItem.bind(this)
    }

    componentDidMount(): void {
        this.subscribeToSharedState(
            "rule_editor_items",
            (value: RuleItem[]) => {
                this.setState({
                    items: value,
                })
            }
        )

        this.subscribeToSharedState(
            "rule_editor_selected_rule_status",
            (value: SelectedItemData): void => {
                if (!value) {
                    value = selectedItemDataInit
                }
                this.setState({
                    selectedItemData: value,
                })
            }
        )

        let isNewRule: boolean

        this.subscribeToSharedState(
            "rule_editor_is_new_rule",
            ({ rule_editor_is_new_rule }) => {
                isNewRule = rule_editor_is_new_rule
            }
        )

        this.subscribeToSharedState(
            "rule_editor_selected_rule_id",
            ({
                rule_editor_selected_rule_id,
            }: {
                rule_editor_selected_rule_id: string
            }) => {
                if (!isNewRule) {
                    this.selectItem({ name: rule_editor_selected_rule_id })
                }
            }
        )
    }

    selectItem(rule: RuleItem) {
        this.setState({
            isNewItem: false,
            isSuccess: false,
            selectedItemId: rule.name,
        })

        this._ruleService.backendFetchRule(rule.name, (data) => {
            if (data === null) {
                this.openSummary()
                return
            }

            const { selectedItemId } = this.state as RuleEditorState
            if (data.name === selectedItemId) {
                this.setState({
                    selectedItem: data,
                })
            }
        })

        this.sharedState.set("rule_editor_selected_rule_id", rule.name)
        this.sharedState.set("rule_editor_is_new_rule", false)
    }

    saveItem(data: RuleItem) {
        const { selectedItemId } = this.state as RuleEditorState
        this._ruleService.backendCreateRule(data, selectedItemId, () => {
            this.setState({ isSuccess: true, selectedItem: data })

            setTimeout(() => {
                this.setState({ isSuccess: false })
            }, 2000)
        })
    }

    deleteItem(data: RuleItem) {
        this._ruleService.backendDeleteRule(data.name, () => {
            this.setState({
                selectedItem: selectedItemInit,
                selectedItemId: null,
            })
            this.sharedState.set("rule_editor_selected_rule_id", null)
        })
    }

    openSummary(): void {
        this.setState({ selectedItem: selectedItemInit, selectedItemId: null })
        this.sharedState.set("rule_editor_selected_rule_id", null)
    }

    createItem(data: RuleItem) {
        this._ruleService.backendCreateRule(data, "", (rule: RuleItem) => {
            this.setState({ isSuccess: true })
            this.selectItem(rule)
        })
    }

    createNewItem() {
        this.sharedState.set("rule_editor_selected_rule_id", null)
        this.sharedState.set("rule_editor_is_new_rule", true)

        this.setState(() => ({
            isNewItem: true,
            selectedItem: {
                name: "",
                enabled: true,
                script: "",
                target: "",
            },
            selectedItemId: null,
            isSuccess: false,
            selectedItemData: selectedItemDataInit,
        }))
    }

    render() {
        const {
            items,
            isNewItem,
            selectedItem,
            selectedItemData,
            selectedItemId,
            isSuccess,
        } = this.state as RuleEditorState

        return (
            <div className="RuleEditor-container" id="ruleEditorComponent">
                <ItemsList
                    type="rule"
                    items={items}
                    selectedItemId={selectedItemId}
                    selectItem={this.selectItem}
                    createNewItem={this.createNewItem}
                    service={this._ruleService} // need to pass service, because it's different for markers and rules editors
                />

                <Editor
                    type="rule"
                    items={items}
                    isNewItem={isNewItem}
                    selectedItem={selectedItem}
                    selectedItemData={selectedItemData}
                    selectedItemId={selectedItemId}
                    createNewItem={this.createNewItem}
                    saveItem={this.saveItem}
                    deleteItem={this.deleteItem}
                    createItem={this.createItem}
                    openSummary={this.openSummary}
                    isSuccess={isSuccess}
                />
            </div>
        )
    }
}
