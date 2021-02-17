import React from "react"
import { Editor } from "./Editor"
import { ItemsList } from "./ItemsList"
import { COLORS, SHAPES } from "../../boot/markerData"
import { EditorItem, SelectedItemData } from "./types"
import { ClassComponent } from "@kubevious/ui-framework"

import { IMarkerService } from "@kubevious/ui-middleware"

const selectedItemInit = {}
const selectedItemDataInit: SelectedItemData = {
    items: [],
    item_count: 0,
    logs: [],
}

type MarkerEditorState = {
    items: EditorItem[]
    selectedItem: EditorItem
    selectedItemData: SelectedItemData
    selectedItemId: string | null | undefined
    isSuccess: boolean
    isNewItem: boolean
}

export class MarkerEditor extends ClassComponent<{}, MarkerEditorState, IMarkerService> {
    constructor(props) {
        super(props, { kind: "marker" })
        this.setState({
            items: [],
            selectedItem: selectedItemInit,
            selectedItemData: selectedItemDataInit,
            isSuccess: false,
        });

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
            selectedItemId: marker.name,
        })
        marker.name &&
            this.service.backendFetchMarker(marker.name, (data) => {
                if (data === null) {
                    this.openSummary()
                    return
                }
                const { selectedItemId } = this.state as MarkerEditorState

                if (data.name === selectedItemId) {
                    this.setState({
                        selectedItem: data,
                    })
                }
            })

        this.sharedState.set("marker_editor_selected_marker_id", marker.name)
    }

    saveItem(data: EditorItem): void {
        const { selectedItemId } = this.state as MarkerEditorState

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
                    selectedItem: selectedItemInit,
                    selectedItemId: null,
                })
                this.sharedState.set("marker_editor_selected_marker_id", null)
            })
        }
    }

    openSummary(): void {
        this.setState({ selectedItem: selectedItemInit, selectedItemId: null })
        this.sharedState.set("marker_editor_selected_marker_id", null)
    }

    createItem(data: EditorItem): void {
        this.service.backendCreateMarker(data, "", (marker) => {
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
            selectedItemId: null,
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
        } = this.state as MarkerEditorState

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
