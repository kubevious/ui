import React from 'react'
import { Editor } from './Editor.jsx'
import { ItemsList } from './ItemsList'
import { COLORS, SHAPES } from '../../boot/markerData'
import { Marker, SelectedItemData } from './types';
import { BaseComponent } from '@kubevious/ui-framework'

import { IMarkerService } from '@kubevious/ui-middleware'

const selectedItemInit = {}
const selectedItemDataInit: SelectedItemData = {
    status: {},
    items: [],
    item_count: 0
}

type MarkerEditorState = {
    items: Marker[]
    selectedItem: Marker
    selectedItemData: SelectedItemData
    selectedItemId: string
    isSuccess: boolean
    isNewItem: boolean
}

export class MarkerEditor extends BaseComponent<IMarkerService> {
    private _markerService: IMarkerService;
    constructor(props) {
        super(props, { kind: 'marker' });
        this.state = {
            items: [],
            selectedItem: selectedItemInit,
            selectedItemData: selectedItemDataInit,
            isSuccess: false
        }
        this._markerService = this.service as IMarkerService
        this.openSummary = this.openSummary.bind(this)
        this.saveItem = this.saveItem.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.createItem = this.createItem.bind(this)
        this.selectItem = this.selectItem.bind(this)
        this.createNewItem = this.createNewItem.bind(this)
    }

    componentDidMount(): void {
        this.subscribeToSharedState('marker_editor_items', (value: Marker[]) => {
            this.setState({
                items: value
            });
        });

        this.subscribeToSharedState('rule_editor_selected_marker_status', (value: SelectedItemData) => {
            if (!value) {
                value = selectedItemDataInit;
            }
            this.setState({
                selectedItemData: value
            });
        });
    }

    selectItem(marker: Marker): void {
        this.setState({
            isNewItem: false,
            isSuccess: false,
            selectedItemId: marker.name
        })
        if (marker.name) {
            this._markerService.backendFetchMarker(marker.name, data => {
                if (data === null) {
                    this.openSummary()
                    return
                }
                const { selectedItemId } = this.state as MarkerEditorState
    
                if (data.name === selectedItemId) {
                    this.setState({
                        selectedItem: data
                    })
                }
            })

        }

        this.sharedState.set('marker_editor_selected_marker_id', marker.name);
    }

    saveItem(data: Marker): void {
        const { selectedItemId } = this.state as MarkerEditorState

        this._markerService.backendCreateMarker(data, selectedItemId, () => {
            this.setState({ isSuccess: true })

            setTimeout(() => {
                this.setState({ isSuccess: false })
            }, 2000)

        })
    }

    deleteItem(data: Marker): void {
        if (data.name) {    
            this._markerService.backendDeleteMarker(data.name, () => {
                this.setState({ selectedItem: selectedItemInit, selectedItemId: null })
                this.sharedState.set('marker_editor_selected_marker_id', null);
            })
        }
    }

    openSummary(): void {
        this.setState({ selectedItem: selectedItemInit, selectedItemId: null })
        this.sharedState.set('marker_editor_selected_marker_id', null);
    }

    createItem(data: Marker): void {
        this._markerService.backendCreateMarker(data, '', (marker) => {
            this.setState({ isSuccess: true })
            this.selectItem(marker)
        })
    }

    createNewItem(): void {
        this.sharedState.set('marker_editor_selected_marker_id', null);

        this.setState(() => ({
            isNewItem: true,
            selectedItem: {
                name: '',
                color: COLORS[0],
                shape: SHAPES[0],
                propagate: false
            },
            isSuccess: false,
            selectedItemId: null,
            selectedItemData: selectedItemDataInit
        }))
    }

    render() {
        const { items, isNewItem, selectedItem, selectedItemData, selectedItemId, isSuccess } = this.state as MarkerEditorState

        return (
            <div className="RuleEditor-container" id="markerEditorComponent">
                <ItemsList
                    type='marker'
                    items={items}
                    selectedItemId={selectedItemId}
                    selectItem={this.selectItem}
                    createNewItem={this.createNewItem}
                    service={this._markerService}
                />

                <Editor type='marker'
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
        );
    }
}
