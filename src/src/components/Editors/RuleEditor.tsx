import React from "react"
import { ClassComponent } from "@kubevious/ui-framework"
import { Editor } from "./Editor"
import "./styles.scss"
import { IRuleService } from "@kubevious/ui-middleware"
import { ItemsList } from "./ItemsList"
import { EditorItem, SelectedItemData } from "./types.js"

const selectedItemInit = {
    name: "",
    enabled: true,
    script: "",
    target: "",
}

const selectedItemDataInit = {
    is_current: true,
    item_count: 0,
    logs: [],
    items: [],
}

type RuleEditorState = {
    selectedTab: string
    items: EditorItem[]
    selectedItemData: SelectedItemData
    selectedItem: EditorItem
    selectedItemId: string
    isSuccess: boolean
    isNewItem: boolean
}

export class RuleEditor extends ClassComponent<
    {},
    RuleEditorState,
    IRuleService
> {
    constructor(props) {
        super(props, { kind: "rule" })

        this.state = {
            selectedTab: "main",
            items: [],
            selectedItem: selectedItemInit,
            selectedItemData: selectedItemDataInit,
            selectedItemId: "",
            isSuccess: false,
            isNewItem: false,
        }

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
            (value: EditorItem[]) => {
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

        this.subscribeToSharedState(
            ["rule_editor_selected_rule_id", "rule_editor_is_new_rule"],
            ({ rule_editor_selected_rule_id, rule_editor_is_new_rule }) => {
                if (!rule_editor_is_new_rule) {
                    this.selectItem({ name: rule_editor_selected_rule_id })
                }
            }
        )
    }

    selectItem(rule: EditorItem) {
        this.setState({
            isNewItem: false,
            isSuccess: false,
            selectedItemId: rule.name || "",
        })

        !rule.name
            ? this.openSummary()
            : this.service.backendFetchRule(rule.name, (data) => {
                  if (data === null) {
                      this.openSummary()
                      return
                  }

                  const { selectedItemId } = this.state
                  if (data.name === selectedItemId) {
                      this.setState({
                          selectedItem: data,
                      })
                  }
              })

        this.sharedState.set("rule_editor_selected_rule_id", rule.name)
        this.sharedState.set("rule_editor_is_new_rule", false)
    }

    saveItem(data: EditorItem) {
        const { selectedItemId } = this.state
        this.service.backendCreateRule(data, selectedItemId, () => {
            this.setState({ isSuccess: true, selectedItem: data })

            setTimeout(() => {
                this.setState({ isSuccess: false })
            }, 2000)
        })
    }

    deleteItem(data: EditorItem) {
        this.service.backendDeleteRule(data.name || "", () => {
            this.setState({
                selectedItem: selectedItemInit,
                selectedItemId: "",
            })
            this.sharedState.set("rule_editor_selected_rule_id", null)
        })
    }

    openSummary(): void {
        this.setState({ selectedItem: selectedItemInit, selectedItemId: "" })
        this.sharedState.set("rule_editor_selected_rule_id", null)
    }

    createItem(data: EditorItem) {
        this.service.backendCreateRule(data, data.name || '', (rule: EditorItem) => {
            this.setState({ isSuccess: true })
            this.selectItem(rule)
        })
    }

    createNewItem() {
        this.sharedState.set("rule_editor_selected_rule_id", null)
        this.sharedState.set("rule_editor_is_new_rule", true)

        this.setState((prevState) => ({
            ...prevState,
            isNewItem: true,
            selectedItem: {
                name: "",
                enabled: true,
                script: "",
                target: "",
            },
            selectedItemId: "",
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
        } = this.state

        return (
            <div className="RuleEditor-container" id="ruleEditorComponent">
                <ItemsList
                    type="rule"
                    items={items}
                    selectedItemId={selectedItemId}
                    selectItem={this.selectItem}
                    createNewItem={this.createNewItem}
                    service={this.service}
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
