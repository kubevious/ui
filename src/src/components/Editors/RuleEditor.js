import React  from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import Editor from './Editor'
import './styles.scss'
import ItemsList from './ItemsList'

const selectedItemInit = {}
const selectedItemDataInit = {
    is_current: true,
    item_count: 0,
    logs: [],
    items: []
}

class RuleEditor extends BaseComponent {
    constructor(props) {
        super(props);

        this.registerService({ kind: 'rule' })

        this.state = {
            selectedTab: 'main',
            items: [],
            selectedItem: selectedItemInit,
            selectedItemData: selectedItemDataInit,
            isSuccess: false,
        }

        this.openSummary = this.openSummary.bind(this)
        this.saveItem = this.saveItem.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.createItem = this.createItem.bind(this)
        this.selectItem = this.selectItem.bind(this)
        this.createNewItem = this.createNewItem.bind(this)
    }

    componentDidMount() {
        this.subscribeToSharedState('rule_editor_items', (value) => {
            this.setState({
                items: value
            });
        });

        this.subscribeToSharedState('rule_editor_selected_rule_status', (value) => {
            if (!value) {
                value = selectedItemDataInit;
            }
            this.setState({
                selectedItemData: value
            });
        });

        this.subscribeToSharedState('rule_editor_selected_rule_id', (rule_editor_selected_rule_id) => {
            this.selectItem({ name: rule_editor_selected_rule_id })
        })
    }

    selectItem(rule) {
        if (rule.name === 'new rule') {
            return
        }

        this.setState({
            isNewItem: false,
            isSuccess: false,
            selectedItemId: rule.name
        })

        this.service.backendFetchRule(rule.name, data => {
            if (data === null) {
                this.openSummary()
                return
            }

            if (data.name === this.state.selectedItemId) {
                this.setState({
                    selectedItem: data
                })
            }
        })


        this.sharedState.set('rule_editor_selected_rule_id', rule.name);
    }

    saveItem(data) {
        this.service.backendCreateRule(data, this.state.selectedItemId, () => {
            this.setState({ isSuccess: true, selectedItem: data })

            setTimeout(() => {
                this.setState({ isSuccess: false })
            }, 2000)
        })
    }

    deleteItem(data) {
        this.service.backendDeleteRule(data.name, () => {
            this.setState({ selectedItem: selectedItemInit, selectedItemId: null })
            this.sharedState.set('rule_editor_selected_rule_id', null);
        })
    }

    openSummary() {
        this.setState({ selectedItem: selectedItemInit, selectedItemId: null })
        this.sharedState.set('rule_editor_selected_rule_id', null);
    }

    createItem(data) {
        this.service.backendCreateRule(data, null, (rule) => {
            this.setState({ isSuccess: true })
            this.selectItem(rule)
        })
    }

    createNewItem() {
        this.sharedState.set('rule_editor_selected_rule_id', 'new rule');

        this.setState(prevState => ({
            isNewItem: true,
            selectedItem: {
                name: '',
                enabled: true,
                script: '',
                target: ''
            },
            selectedItemId:  null,
            isSuccess: false,
            selectedItemData: selectedItemDataInit
        }))
    }

    render() {
        const { items, isNewItem, selectedItem, selectedItemData, selectedItemId, isSuccess } = this.state

        return (
            <div className="RuleEditor-container" id="ruleEditorComponent">
                <ItemsList
                    type='rule'
                    items={items}
                    selectedItemId={selectedItemId}
                    selectItem={this.selectItem}
                    createNewItem={this.createNewItem}
                    service={this.service} // need to pass service, because it's different for markers and rules editors
                />

                <Editor type='rule'
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

export default RuleEditor
