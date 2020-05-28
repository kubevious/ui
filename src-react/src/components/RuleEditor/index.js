import React, { PureComponent } from 'react'
import $ from 'jquery'
import RulesList from './RulesList'
import Editor from './Editor'
import './styles.scss'
import { getRandomInt } from '../../utils/util'

const selectedRuleInit = {}
const selectedRuleDataInit = {
    status: {},
    logs: [],
    items: []
}

class RuleEditor extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            selectedTab: 'rule',
            rules: [],
            selectedRule: selectedRuleInit,
            selectedRuleData: selectedRuleDataInit,
            isSuccess: false,
            deleteExtra: false,
            isMergeOptionsVisible: false
        }

        this.service = this.props.service.rules()

        this.openSummary = this.openSummary.bind(this)
        this.saveRule = this.saveRule.bind(this)
        this.deleteRule = this.deleteRule.bind(this)
        this.uploadFile = this.uploadFile.bind(this)
        this.createRule = this.createRule.bind(this)
        this.setVisibleOptions = this.setVisibleOptions.bind(this)
        this.selectRule = this.selectRule.bind(this)
        this.createNewRule = this.createNewRule.bind(this)
    }

    get sharedState() {
        return this.props.state;
    }

    componentDidMount() {
        this.sharedState.subscribe('rule_editor_items', (value) => {
            this.setState({
                rules: value
            });
        });

        this.sharedState.subscribe('rule_editor_selected_rule_status', (value) => {
            if (!value) {
                value = selectedRuleDataInit;
            }
            this.setState({
                selectedRuleData: value
            });
        });
    }

    selectRule(rule) {
        this.setState({
            isNewRule: false,
            isSuccess: false,
            selectedRuleId: rule.id
        })

        this.service.backendFetchRule(rule.id, data => {
            if (data.id == this.state.selectedRuleId) {
                this.setState({
                    selectedRule: data
                })
            }
        })


        this.sharedState.set('rule_editor_selected_rule_id', rule.id);
    }

    saveRule(data) {
        this.service.backendUpdateRule(data.id, data, () => {
            this.setState({ isSuccess: true })

            setTimeout(() => {
                this.setState({ isSuccess: false })
            }, 2000)
        })
    }

    deleteRule(data) {
        this.service.backendDeleteRule(data.id, () => {
            this.setState({ selectedRule: selectedRuleInit, selectedRuleId: null })
            this.sharedState.set('rule_editor_selected_rule_id', null);
        })
    }

    openSummary() {
        this.setState({ selectedRule: selectedRuleInit, selectedRuleId: null })
        this.sharedState.set('rule_editor_selected_rule_id', null);
    }

    createRule(data) {
        this.service.backendCreateRule(data, (rule) => {
            this.setState({ isSuccess: true })
            this.selectRule(rule)
        })
    }

    createNewRule() {
        this.sharedState.set('rule_editor_selected_rule_id', null);

        this.setState(prevState => ({
            isNewRule: true,
            selectedRule: {
                name: '',
                enabled: true,
                script: '',
                target: ''
            },
            isSuccess: false,
            selectedRuleData: selectedRuleDataInit
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
            <div className="RuleEditor-container">
                <RulesList
                    rules={this.state.rules}
                    selectedRuleId={this.state.selectedRuleId}
                    selectRule={this.selectRule}
                    createNewRule={this.createNewRule}
                    setVisibleOptions={this.setVisibleOptions}
                    service={this.service}/>

                <Editor rules={this.state.rules}
                        isNewRule={this.state.isNewRule}
                        selectedRule={this.state.selectedRule}
                        selectedRuleData={this.state.selectedRuleData}
                        selectedRuleId={this.state.selectedRuleId}
                        createNewRule={this.createNewRule}
                        saveRule={this.saveRule}
                        deleteRule={this.deleteRule}
                        createRule={this.createRule}
                        openSummary={this.openSummary}
                        state={this.props.state}
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
                                <b>Merge</b> from backup preserving existing roles
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