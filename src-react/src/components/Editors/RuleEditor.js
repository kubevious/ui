import React  from 'react'
import BaseComponent from '../BaseComponent'
import $ from 'jquery'
import Editor from './Editor'
import './styles.scss'
import { getRandomInt } from '../../utils/util'
import ItemsList from './ItemsList'

const selectedItemInit = {}
const selectedItemDataInit = {
    status: {
        isCurrent: true,
        item_count: 0
    },
    logs: [],
    items: []
}

class RuleEditor extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            selectedTab: 'main',
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

    get service() {
        return this._service._ruleService
    }

    componentDidMount() {
        this.sharedState.subscribe('rule_editor_items', (value) => {
            this.setState({
                items: value
            });
        });

        this.sharedState.subscribe('rule_editor_selected_rule_status', (value) => {
            if (!value) {
                value = selectedItemDataInit;
            }
            this.setState({
                selectedItemData: value
            });
        });
    }

    selectItem(rule) {
        this.setState({
            isNewItem: false,
            isSuccess: false,
            selectedItemId: rule.id
        })

        this.service.backendFetchRule(rule.id, data => {
            if (data.id == this.state.selectedItemId) {
                this.setState({
                    selectedItem: data
                })
            }
        })


        this.sharedState.set('rule_editor_selected_rule_id', rule.id);
    }

    saveItem(data) {
        this.service.backendUpdateRule(data.id, data, () => {
            this.setState({ isSuccess: true })

            setTimeout(() => {
                this.setState({ isSuccess: false })
            }, 2000)
        })
    }

    deleteItem(data) {
        this.service.backendDeleteRule(data.id, () => {
            this.setState({ selectedItem: selectedItemInit, selectedItemId: null })
            this.sharedState.set('rule_editor_selected_rule_id', null);
        })
    }

    openSummary() {
        this.setState({ selectedItem: selectedItemInit, selectedItemId: null })
        this.sharedState.set('rule_editor_selected_rule_id', null);
    }

    createItem(data) {
        this.service.backendCreateRule(data, (rule) => {
            this.setState({ isSuccess: true })
            this.selectItem(rule)
        })
    }

    createNewItem() {
        this.sharedState.set('rule_editor_selected_rule_id', null);

        this.setState(prevState => ({
            isNewItem: true,
            selectedItem: {
                name: '',
                enabled: true,
                script: '',
                target: ''
            },
            isSuccess: false,
            selectedItemData: selectedItemDataInit
        }))
    }

    uploadFile() {
        const input = document.getElementById('upload-rule')

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
            this.service.backendImportRules(importData, () => {

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
            <div className="RuleEditor-container" id="ruleEditorComponent">
                <ItemsList
                    type='rule'
                    items={this.state.items}
                    selectedItemId={this.state.selectedItemId}
                    selectItem={this.selectItem}
                    createNewItem={this.createNewItem}
                    setVisibleOptions={this.setVisibleOptions}
                    service={this.service}/>

                <Editor type='rule'
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
                        sharedState={this.sharedState}
                        isSuccess={this.state.isSuccess}
                />

                <div id="import-container"
                     style={{ display: this.state.isMergeOptionsVisible ? 'initial' : 'none' }}>
                    <div className="import-caret"/>
                    <div className="import-options">
                        <div className="option">
                            <label htmlFor="upload-rule" className="option-desc"
                                   onClick={() => this.setState({ deleteExtra: true })}>
                                <b>Restore</b> from backup
                            </label>
                        </div>

                        <div className="option">
                            <label htmlFor="upload-rule" className="option-desc"
                                   onClick={() => this.setState({ deleteExtra: false })}>
                                <b>Merge</b> from backup preserving existing rules
                            </label>
                        </div>

                        <input type='file' id='upload-rule' name='upload-rule' onChange={this.uploadFile}/>
                    </div>
                </div>
            </div>
        );
    }

}

export default RuleEditor