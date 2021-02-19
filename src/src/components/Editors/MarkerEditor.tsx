import React from "react"
import { Editor } from "./Editor"
import { ItemsList } from "./ItemsList"
import { COLORS, SHAPES } from "../../boot/markerData"
import { EditorItem, MarkerEditorState, SelectedItemData } from "./types"
import { ClassComponent } from "@kubevious/ui-framework"

import { IMarkerService } from "@kubevious/ui-middleware"

const selectedItemDataInit: SelectedItemData = {
    items: [],
    item_count: 0,
    logs: [],
}

export class MarkerEditor extends ClassComponent<
    {},
    MarkerEditorState,
    IMarkerService
> {
    constructor(props) {
        super(props, null, { kind: "marker" })
        this.state = {
            items: [],
            selectedItem: {},
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
            "marker_editor_items",
            (value: EditorItem[]) => {
                this.setState({
                    items: value,
                })
            }
        )

        this.subscribeToSharedState(
            "rule_editor_selected_marker_status",
            (value: SelectedItemData) => {
                if (!value) {
                    value = selectedItemDataInit
                }
                this.setState({
                    selectedItemData: value,
                })
            }
        )
    }

    selectItem(marker: EditorItem): void {
        this.setState({
            isNewItem: false,
            isSuccess: false,
            selectedItemId: marker.name || "",
        })
        marker.name &&
            this.service.backendFetchMarker(marker.name, (data) => {
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

        this.sharedState.set("marker_editor_selected_marker_id", marker.name)
    }

    saveItem(data: EditorItem): void {
        const { selectedItemId } = this.state

        this.service.backendCreateMarker(data, selectedItemId!, () => {
            this.setState({ isSuccess: true })

            setTimeout(() => {
                this.setState({ isSuccess: false })
            }, 2000)
        })
    }

    deleteItem(data: EditorItem): void {
        if (data.name) {
            this.service.backendDeleteMarker(data.name, () => {
                this.setState({
                    selectedItem: {},
                    selectedItemId: "",
                })
                this.sharedState.set("marker_editor_selected_marker_id", null)
            })
        }
    }

    openSummary(): void {
        this.setState({ selectedItem: {}, selectedItemId: "" })
        this.sharedState.set("marker_editor_selected_marker_id", null)
    }

    createItem(data: EditorItem): void {
        this.service.backendCreateMarker(data, data.name || "", (marker) => {
            this.setState({ isSuccess: true })
            this.selectItem(marker)
        })
    }

    createNewItem(): void {
        this.sharedState.set("marker_editor_selected_marker_id", null)

        this.setState(() => ({
            isNewItem: true,
            selectedItem: {
                name: "",
                color: COLORS[0],
                shape: SHAPES[0],
                propagate: false,
            },
            isSuccess: false,
            selectedItemId: "",
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
            <div className="RuleEditor-container" id="markerEditorComponent">
                <ItemsList
                    type="marker"
                    items={items}
                    selectedItemId={selectedItemId}
                    selectItem={this.selectItem}
                    createNewItem={this.createNewItem}
                    service={this.service}
                />

                <Editor
                    type="marker"
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
