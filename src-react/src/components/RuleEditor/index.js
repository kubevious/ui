import React, { PureComponent } from 'react'
import $ from 'jquery'
import RulesList from './RulesList'
import Editor from './Editor'
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/theme/darcula.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import './styles.scss'
import { getRandomInt } from '../../utils/util'

const selectedRuleInit = {}
const selectedRuleDataInit = {
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
            this.setState({ rules: value })
        })
    }

    refresh() {
        this.service.backendFetchRuleList((response) => {
            this.setState({ rules: response })
        })
    }

    selectRule(rule) {
        this.setState({ isSuccess: false })

        if (rule) {
            this.sharedState.set('rule_editor_rule_id', rule.id);
        } else {
            this.sharedState.set('rule_editor_rule_id', null);
        }

        this.service.backendFetchRule(rule.id, data => {
            this.setState({
                selectedRule: { ...data.rule },
                selectedRuleData: {
                    items: data.items,
                    logs: data.logs
                },
                selectedTab: 'rule'
            })
        })
    }

    saveRule(data) {
        this.service.backendUpdateRule(data.id, data, () => {
            this.setState({ isSuccess: true })
            this.refresh()
        })
    }

    deleteRule(data) {
        this.service.backendDeleteRule(data.id, () => {
            this.setState({ selectedRule: selectedRuleInit, selectedRuleData: selectedRuleDataInit })

            this.refresh()
        })
    }

    openSummary() {
        this.setState({ selectedRule: selectedRuleInit, selectedRuleData: selectedRuleDataInit })
    }

    createRule(data) {
        this.service.backendCreateRule(data, () => {
            this.setState({ isSuccess: true })
            this.refresh()
        })
    }

    createNewRule() {
        this.setState(prevState => ({
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
            this.service.backendImportRules({
                data: JSON.parse(reader.result).map((item) => ({ ...item, id: getRandomInt() })),
                deleteExtra: this.state.deleteExtra
            }, () => {
                this.refresh()
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
                <RulesList rules={this.state.rules} selectRule={this.selectRule} createNewRule={this.createNewRule}
                           setVisibleOptions={this.setVisibleOptions} service={this.service} selectedRule={this.state.selectedRule}/>

                <Editor rules={this.state.rules} selectedRule={this.state.selectedRule}
                        selectedRuleData={this.state.selectedRuleData} createNewRule={this.createNewRule}
                        saveRule={this.saveRule} deleteRule={this.deleteRule} createRule={this.createRule}
                        openSummary={this.openSummary} state={this.props.state} isSuccess={this.state.isSuccess}
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