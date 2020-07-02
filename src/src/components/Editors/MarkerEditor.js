import React from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import Editor from './Editor'
import ItemsList from './ItemsList'
import { COLORS, SHAPES } from '../../boot/markerData'

const selectedItemInit = {}
const selectedItemDataInit = {
    status: {},
    items: []
}

class MarkerEditor extends BaseComponent {
    constructor(props) {
        super(props);

        this.registerService({ kind: 'marker' })

        this.state = {
            items: [],
            selectedItem: selectedItemInit,
            selectedItemData: selectedItemDataInit,
            isSuccess: false
        }

        this.openSummary = this.openSummary.bind(this)
        this.saveItem = this.saveItem.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.createItem = this.createItem.bind(this)
        this.selectItem = this.selectItem.bind(this)
        this.createNewItem = this.createNewItem.bind(this)
    }

    componentDidMount() {
        this.subscribeToSharedState('marker_editor_items', (value) => {
            this.setState({
                items: value
            });
        });

        this.subscribeToSharedState('marker_editor_selected_items', (value) => {
            if (value) {
                if (value.name === this.state.selectedItemId) {
                    var items = [];
                    if (value.items) {
                        items = value.items;
                    }
                    this.setState({
                        selectedItemData: {
                            item_count: items.length,
                            items: items
                        }
                    });
                }
            }
        });
    }

    selectItem(marker) {
        this.setState({
            isNewItem: false,
            isSuccess: false,
            selectedItemId: marker.name
        })

        this.service.backendFetchMarker(marker.name, data => {
            if (data.name === this.state.selectedItemId) {
                this.setState({
                    selectedItem: data
                })
            }
        })

        this.sharedState.set('marker_editor_selected_marker_id', marker.name);
    }

    saveItem(data) {
        this.service.backendCreateMarker(data, this.state.selectedItemId, () => {
            this.setState({ isSuccess: true })

            setTimeout(() => {
                this.setState({ isSuccess: false })
            }, 2000)

        })
    }

    deleteItem(data) {
        this.service.backendDeleteMarker(data.name, () => {
            this.setState({ selectedItem: selectedItemInit, selectedItemId: null })
            this.sharedState.set('marker_editor_selected_marker_id', null);
        })
    }

    openSummary() {
        this.setState({ selectedItem: selectedItemInit, selectedItemId: null })
        this.sharedState.set('marker_editor_selected_marker_id', null);
    }

    createItem(data) {
        this.service.backendCreateMarker(data, null, (marker) => {
            this.setState({ isSuccess: true })
            this.selectItem(marker)
        })
    }

    createNewItem() {
        this.sharedState.set('marker_editor_selected_marker_id', null);

        this.setState(prevState => ({
            isNewItem: true,
            selectedItem: {
                name: '',
                color: COLORS[0],
                shape: SHAPES[0],
                propagate: false
            },
            isSuccess: false,
            selectedItemData: selectedItemDataInit
        }))
    }

    render() {
        const { items, isNewItem, selectedItem, selectedItemData, selectedItemId, isSuccess } = this.state

        return (
            <div className="RuleEditor-container" id="markerEditorComponent">
                <ItemsList
                    type='marker'
                    items={items}
                    selectedItemId={selectedItemId}
                    selectItem={this.selectItem}
                    createNewItem={this.createNewItem}
                    service={this.service}
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

export default MarkerEditor
