import React, { Component, createRef } from 'react'
import $ from 'jquery'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDownload, faUndo } from '@fortawesome/free-solid-svg-icons'
import { isEmptyArray, isEmptyObject } from '../../utils/util'
import cx from 'classnames'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/theme/darcula.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import './styles.scss'
import DnShortcutComponent from '../DnShortcutComponent'

const selectedRuleInit = {}
const selectedRuleDataInit = {
    logs: [],
    items: []
}

class RuleEditor extends Component {
    constructor(props) {
        super(props);

        this.scriptRef = createRef()

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
        this.export = this.export.bind(this)
        this.uploadFile = this.uploadFile.bind(this)
        this.isEmptyFields = this.isEmptyFields.bind(this)
        this.renderRuleEditor = this.renderRuleEditor.bind(this)
        this.createRule = this.createRule.bind(this)
    }

    get sharedState() {
        return this.props.state;
    }

    componentDidMount() {
        // this.refresh()

        this.sharedState.subscribe('rule_editor_items', (value) => {
            this.setState({ rules: value })
        })
    }

    refresh() {
        // this.service.backendFetchRuleList((response) => {
        //     this.setState({ rules: response })
        // })
    }

    selectTab(tab) {
        this.setState({ selectedTab: tab })
    }

    selectRule(rule) {
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

    changeName(ruleName) {
        this.setState(prevState => ({
            selectedRule: {
                ...prevState.selectedRule,
                name: ruleName
            }
        }))
    }

    changeTarget({ editor, data, value }) {
        this.setState(prevState => ({
            selectedRule: {
                ...prevState.selectedRule,
                target: value
            }
        }))
    }

    changeScript({ editor, data, value }) {
        this.setState(prevState => ({
            selectedRule: {
                ...prevState.selectedRule,
                script: value
            }
        }))
    }

    changeEnable(e) {
        const { enabled } = this.state.selectedRule

        this.setState(prevState => ({
            selectedRule: {
                ...prevState.selectedRule,
                enabled: !enabled
            }
        }))
    }

    saveRule() {
        this.service.backendUpdateRule(this.state.selectedRule.id, this.state.selectedRule, () => {
            this.setState({ isSuccess: true })
            this.refresh()

            setTimeout(() => {
                this.setState({ isSuccess: false })
            }, 2000)
        })
    }

    deleteRule() {
        this.service.backendDeleteRule(this.state.selectedRule.id, () => {
            this.setState({ selectedRule: selectedRuleInit, selectedRuleData: selectedRuleDataInit })

            this.refresh()
        })
    }

    openSummary() {
        this.setState({ selectedRule: {}, selectedRuleData: { logs: [], items: [] } })
    }

    createRule() {
        this.service.backendCreateRule(this.state.selectedRule, () => {
            this.setState({ isSuccess: true })

            setTimeout(() => {
                this.setState({
                    selectedRule: selectedRuleInit,
                    selectedRuleData: selectedRuleDataInit,
                    isSuccess: false
                })
                this.refresh()
            }, 2000)

        })
    }

    handleKeyUp({ editor, data, value }) {
        const cm = $('.CodeMirror')[1].CodeMirror

        if (!cm.state.completionActive && data.keyCode > 64 && data.keyCode < 91) {
            // CodeMirror.commands.autocomplete(cm, null, { completeSingle: false })
        }
    }

    renderEditor() {
        return (
            <>
                {!this.state.isSuccess && <>
                    <div className="editor-title">
                        {this.isEmptyFields() && <div className='editor-title'>Create new rule</div>}
                        {!this.isEmptyFields() && <>
                            <div className={cx('tab rule-tab', { 'selected': this.state.selectedTab === 'rule' })}
                                 onClick={() => this.selectTab('rule')}>Editor rule
                            </div>
                            <div
                                className={cx('tab object-tab', { 'selected': this.state.selectedTab === 'object' })}
                                onClick={() => this.selectTab('object')}
                            >
                                Affected object ({this.state.selectedRuleData.items.length})
                            </div>
                        </>}

                    </div>

                    {this.state.selectedTab === 'rule' && this.renderRuleEditor()}

                    {this.state.selectedTab === 'object' && !isEmptyArray(this.state.selectedRuleData.items) && this.renderAffectedObjects()}
                </>}

                {this.state.isSuccess && this.renderSuccessPage()}
            </>
        )
    }

    renderStartPage() {
        return(
            <div className="start-rule-container">
                <div className="start-wrapper">
                    <div className="start-text">You have no rules defined. Time to create your new rule:</div>
                    <div className="start-btn-wrapper">
                        <button className="button success new-rule-btn" onClick={() => this.createNewRule()}>
                            <div className="plus">+</div> New rule
                        </button>
                    </div>
                    <div className="start-text">Learn more about Kubevious rule here</div>
                </div>
            </div>
        )

    }

    renderSuccessPage() {
        return (
            <div className="success-page">
                <FontAwesomeIcon icon={faCheck} className="check-icon"/>
                Rule successfully saved
            </div>
        )
    }

    renderAffectedObjects() {
        return (
            <>
                {this.state.selectedRuleData.items.map((item, index) => (
                    <DnShortcutComponent key={index} dn={item.dn} state={this.props.state}/>
                ))}
            </>
        )
    }

    setErrorEditor(field) {
        return this.state.selectedRuleData.logs.find(item => item.msg.source.includes(field)) &&
            this.state.selectedRuleData.logs.find(item => item.msg.source.includes(field)).length !== 0
    }

    renderRuleEditor() {
        return (
            <>
                <div className="field">
                    <div className="label-wrapper">
                        <label>Name</label>
                    </div>
                    <input
                        type="text"
                        className="field-input name"
                        value={this.state.selectedRule.name}
                        onChange={(e) => this.changeName(e.target.value)}
                    />
                </div>

                <div className="field">
                    <div className="label-wrapper">
                        <label>Target</label>
                    </div>
                    <CodeMirror
                        value={this.state.selectedRule.target}
                        options={{
                            mode: 'javascript',
                            theme: 'darcula',
                            lineNumbers: true
                        }}
                        className={cx({ 'required-field': this.setErrorEditor('target') })}
                        onChange={(editor, data, value) => this.changeTarget({ editor, data, value })}
                    />
                </div>

                <div className="field">
                    <div className="label-wrapper">
                        <label>Script</label>
                    </div>
                    <CodeMirror
                        ref={this.scriptRef}
                        value={this.state.selectedRule.script}
                        options={{
                            mode: 'javascript',
                            theme: 'darcula',
                            lineNumbers: true

                        }}
                        className={cx({ 'required-field': this.setErrorEditor('script') })}
                        onKeyUp={(editor, data, value) => this.handleKeyUp({ editor, data, value })}
                        onChange={(editor, data, value) => this.changeScript({ editor, data, value })}
                    />
                </div>

                <div className="editor-errors">
                    {this.state.selectedRuleData && !isEmptyArray(this.state.selectedRuleData.logs) && this.state.selectedRuleData.logs.map((err, index) => (
                        <div className="err-box" key={index}>
                            <div className="alert-item error"/>
                            {err.msg.msg}
                        </div>
                    ))}
                </div>

                <label className="checkbox-container">
                    Enable/Disable
                    <input type="checkbox" className="enable-checkbox" checked={this.state.selectedRule.enabled}
                           onChange={(event) => this.changeEnable(event)}/>
                    <span className="checkmark"/>
                </label>

                <div className="btn-group">
                    {this.state.selectedRule.id && <>
                        <button className="button" onClick={this.deleteRule}>Delete</button>
                        <button className="button" onClick={this.openSummary}>Cancel</button>
                        <button className="button success" onClick={this.saveRule}>Save</button>
                    </>}
                    {!this.state.selectedRule.id &&
                    <button className="button success" onClick={this.createRule}>Create</button>}

                </div>
            </>
        )
    }

    createNewRule() {
        this.setState(prevState => ({
            selectedRule: {
                name: '',
                enabled: true,
                script: '',
                target: ''
            },
            selectedRuleData: selectedRuleDataInit
        }))

        this.renderEditor()
    }

    export() {
        this.service.backendExportRules(response => {
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(response))
            const exportElem = document.getElementById('exportAnchor')
            exportElem.setAttribute('href', dataStr)
            exportElem.setAttribute('download', 'rules.json')
            exportElem.click()
        })
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
                data: JSON.parse(reader.result),
                deleteExtra: this.state.deleteExtra
            }, () => {
                this.refresh()
            })
        };

        reader.readAsText(input.files[0]);
    }

    isEmptyFields() {
        return Object.values(this.state.selectedRule).some(item => item === '')
    }

    render() {
        $('body').click((e) => {
            if (!$(e.target).closest('.rule-header').length) {
                this.setState({ isMergeOptionsVisible: false })
            }
        })

        return (
            <div className="RuleEditor-container">
                <div id="rule-list">
                    <div className="rule-header">
                        <div className="btn-group">
                            <button className="button success new-rule-btn" onClick={() => this.createNewRule()}>
                                <div className="plus">+</div>
                                New rule
                            </button>
                            <button className="button square light export" onClick={this.export}>
                                <FontAwesomeIcon icon={faDownload}/>
                            </button>
                            <a id='exportAnchor' style={{ display: 'none' }}/>
                            <button className="button square light"
                                    onClick={() => this.setState({ isMergeOptionsVisible: true })}>
                                <FontAwesomeIcon icon={faUndo}/>
                            </button>
                        </div>
                    </div>

                    <div className="rules">
                        {!isEmptyArray(this.state.rules) && this.state.rules.map(rule => (
                            <button key={rule.id} className="rule-item-button" onClick={() => this.selectRule(rule)}>
                                {rule.name}
                                <div
                                    className={cx('indicator', { 'enabled': rule.enabled }, { 'disabled': !rule.enabled })}/>
                            </button>
                        ))}
                    </div>
                </div>
                <div id="rule-editor">
                    <div className="rule-container">
                        {isEmptyObject(this.state.rules) && isEmptyObject(this.state.selectedRule) && this.renderStartPage()}
                        {!isEmptyObject(this.state.selectedRule) && this.renderEditor()}
                        {!isEmptyObject(this.state.rules) && isEmptyObject(this.state.selectedRule) && <div className="no-rule">No selected rule</div>}
                    </div>

                    <div id="import-container"
                         style={{ display: this.state.isMergeOptionsVisible ? 'initial' : 'none' }}>
                        <div className="import-caret"/>
                        <div className="import-options">
                            <div className="option">
                                <label for="upload-rule" className="option-desc"
                                       onClick={() => this.setState({ deleteExtra: true })}>
                                    <b>Restore</b> from backup
                                </label>
                            </div>

                            <div className="option">
                                <label for="upload-rule" className="option-desc"
                                       onClick={() => this.setState({ deleteExtra: false })}>
                                    <b>Merge</b> from backup preserving existing roles
                                </label>
                            </div>

                            <input type='file' id='upload-rule' name='upload-rule' onChange={this.uploadFile}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default RuleEditor