import React, { PureComponent } from 'react'
import { getRandomInt } from '../../utils/util'
import $ from 'jquery'
import Editor from './Editor'
import ItemsList from './ItemsList'
import { COLORS, SHAPES } from '../../boot/markerData'

const selectedItemInit = {}
const selectedItemDataInit = {
    status: {},
    logs: [],
    items: []
}

class MarkerEditor extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            selectedItem: selectedItemInit,
            selectedItemData: selectedItemDataInit,
            isSuccess: false,
            deleteExtra: false,
            isMergeOptionsVisible: false
        }

        this.openSummary = this.openSummary.bind(this)
        this.saveItem = this.saveItem.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.uploadFile = this.uploadFile.bind(this)
        this.createItem = this.createItem.bind(this)
        this.setVisibleOptions = this.setVisibleOptions.bind(this)
        this.selectItem = this.selectItem.bind(this)
        this.createNewItem = this.createNewItem.bind(this)
    }

    get sharedState() {
        return this.props.sharedState;
    }

    get service() {
        return this.props.service.markers()
    }

    componentDidMount() {
        this.sharedState.subscribe('marker_editor_items', (value) => {
            this.setState({
                items: value
            });
        });

        this.sharedState.subscribe('marker_editor_selected_marker_status', (value) => {
            if (!value) {
                value = selectedItemDataInit;
            }
            this.setState({
                selectedItemData: value
            });
        });
    }

    selectItem(marker) {
        this.setState({
            isNewItem: false,
            isSuccess: false,
            selectedItemId: marker.id
        })

        this.service.backendFetchMarker(marker.id, data => {
            if (data.id == this.state.selectedItemId) {
                this.setState({
                    selectedItem: data
                })
            }
        })


        this.sharedState.set('marker_editor_selected_marker_id', marker.id);
    }

    saveItem(data) {
        this.service.backendUpdateMarker(data.id, data, () => {
            this.setState({ isSuccess: true })

            setTimeout(() => {
                this.setState({ isSuccess: false })
            }, 2000)
        })
    }

    deleteItem(data) {
        this.service.backendDeleteMarker(data.id, () => {
            this.setState({ selectedItem: selectedItemInit, selectedItemId: null })
            this.sharedState.set('marker_editor_selected_marker_id', null);
        })
    }

    openSummary() {
        this.setState({ selectedItem: selectedItemInit, selectedItemId: null })
        this.sharedState.set('marker_editor_selected_marker_id', null);
    }

    createItem(data) {
        this.service.backendCreateMarker(data, (marker) => {
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

    uploadFile() {
        const input = document.getElementById('upload-marker')

        if (input.files.length === 0) {
            console.error('No file selected.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            var importData = {
                data: JSON.parse(reader.result).map((item) => ({ ...item, id: getRandomInt() })),
                deleteExtra: this.state.deleteExtra
            };
            this.service.backendImportMarkers(importData, () => {

            })
        };

        reader.readAsText(input.files[0]);
    }

    setVisibleOptions(value) {
        this.setState({ isMergeOptionsVisible: value })
    }

    render() {
        $('body').click((e) => {
            if (!$(e.target).closest('.rule-header').length) {
                this.setVisibleOptions(false)
            }
        })

        return (
            <div className="RuleEditor-container">
                <ItemsList
                    type='marker'
                    items={this.state.items}
                    selectedItemId={this.state.selectedItemId}
                    selectItem={this.selectItem}
                    createNewItem={this.createNewItem}
                    setVisibleOptions={this.setVisibleOptions}
                    service={this.service}/>

                <Editor type='marker'
                        items={this.state.items}
                        isNewItem={this.state.isNewItem}
                        selectedItem={this.state.selectedItem}
                        selectedItemData={this.state.selectedItemData}
                        selectedItemId={this.state.selectedItemId}
                        createNewItem={this.createNewItem}
                        saveItem={this.saveItem}
                        deleteItem={this.deleteItem}
                        createItem={this.createItem}
                        openSummary={this.openSummary}
                        sharedState={this.props.sharedState}
                        isSuccess={this.state.isSuccess}
                />

                <div id="import-container"
                     style={{ display: this.state.isMergeOptionsVisible ? 'initial' : 'none' }}>
                    <div className="import-caret"/>
                    <div className="import-options">
                        <div className="option">
                            <label htmlFor="upload-marker" className="option-desc"
                                   onClick={() => this.setState({ deleteExtra: true })}>
                                <b>Restore</b> from backup
                            </label>
                        </div>

                        <div className="option">
                            <label htmlFor="upload-marker" className="option-desc"
                                   onClick={() => this.setState({ deleteExtra: false })}>
                                <b>Merge</b> from backup preserving existing markers
                            </label>
                        </div>

                        <input type='file' id='upload-marker' name='upload-marker' onChange={this.uploadFile}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default MarkerEditor
