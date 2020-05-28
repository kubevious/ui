import React, { useEffect, useMemo, useState } from 'react'
import { isEmptyArray, isEmptyObject } from '../../utils/util'
import { UnControlled as CodeMirrorEditor } from 'react-codemirror2'
import cx from 'classnames'
import Codemirror from 'codemirror'
import DnShortcutComponent from '../DnShortcutComponent'

import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/theme/darcula.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'

const Editor = ({ rules, isNewRule, selectedRule, selectedRuleData, selectedRuleId, createNewRule, saveRule, deleteRule, createRule, openSummary, state, isSuccess }) => {
    const [selectedTab, setSelectedTab] = useState('rule')
    const [rule, setRule] = useState({})
    const [ruleId, setRuleId] = useState(null)

    const snippets = [
        { text: 'select', displayText: 'select' },
        { text: 'resource', displayText: 'resource' },
        { text: 'child', displayText: 'child' },
        { text: 'descendant', displayText: 'descendant' },
        { text: 'filter', displayText: 'filter' },
        { text: 'labels', displayText: 'labels' },
        { text: 'label', displayText: 'label' },
        { text: 'name', displayText: 'name' },
        { text: 'debugOutput', displayText: 'debugOutput' }
    ]

    useEffect(() => {
        if (selectedRuleId !== ruleId) {
            setRuleId(ruleId)
            setRule({ ...selectedRule })
            setSelectedTab('rule')
        }
    }, [selectedRuleId, selectedRule])

    const setErrorEditor = (field) => {
        return selectedRuleData.logs.find(item => item.msg.source.includes(field)) &&
            selectedRuleData.logs.find(item => item.msg.source.includes(field)).length !== 0
    }

    const handleChange = (e) => {
        setRule({ ...rule, [e.target.name]: e.target.value })
    }

    const handleChangeTarget = ({ editor, data, value }) => {
        setRule({ ...rule, target: value })
    }

    const handleChangeScript = ({ editor, data, value }) => {
        setRule({ ...rule, script: value })
    }

    const changeEnable = (e) => {
        setRule({ ...rule, enabled: !rule.enabled })
    }

    const validation = useMemo(() => Object.values(rule).some(item => item === ''), [rule])

    const renderStartPage = () => {
        return (
            <div className="start-rule-container">
                <div className="start-wrapper">
                    <div className="start-text">You have no rules defined. Time to create your new rule:</div>
                    <div className="start-btn-wrapper">
                        <button className="button success new-rule-btn" onClick={() => createNewRule()}>
                            <div className="plus">+</div>
                            New rule
                        </button>
                    </div>
                    <div className="start-text">Learn more about Kubevious rule here</div>
                </div>
            </div>
        )
    }

    const renderAffectedObjects = () => {
        return (
            <>
                {selectedRuleData.items.map((item, index) => (
                    <DnShortcutComponent key={index} dn={item.dn} state={state}/>
                ))}
            </>
        )
    }

    const renderEditor = () => {
        return (
            <>
                <div className="editor-title">
                    {!isNewRule && selectedRuleData && !selectedRuleData.status.isCurrent &&
                    <div className="busy-rule-indicator"/>
                    }
                    {isNewRule && <div className='editor-title'>Create new rule</div>}
                    {!isNewRule && <>
                        <div className={cx('tab rule-tab', { 'selected': selectedTab === 'rule' })}
                             onClick={() => setSelectedTab('rule')}>Editor rule
                        </div>
                        <div
                            className={cx('tab object-tab', { 'selected': selectedTab === 'object' })}
                            onClick={() => setSelectedTab('object')}
                        >
                            Affected object ({selectedRuleData.items.length})
                        </div>
                    </>}

                </div>

                {selectedTab === 'rule' && renderRuleEditor()}

                {selectedTab === 'object' && !isEmptyArray(selectedRuleData.items) && renderAffectedObjects()}
            </>
        )
    }

    const handleScriptKeyUp = ({ editor, data, value }) => {
        if (data.keyCode > 64 && data.keyCode < 91) {
            Codemirror.commands.autocomplete(editor, null, { completeSingle: false })
        }
    }

    const handleTargetKeyUp = ({ editor, data, value }) => {
        if (data.keyCode > 64 && data.keyCode < 91) {
            showSnippets(editor)
        }
    }

    const showSnippets = (editor) => {
        Codemirror.showHint(editor, function () {
            const cursor = editor.getCursor()
            const token = editor.getTokenAt(cursor)
            const start = token.start
            const end = cursor.ch
            const line = cursor.line
            const currentWord = token.string

            const list = snippets.filter(function (item) {
                return item.text.indexOf(currentWord) >= 0
            })

            return {
                list: list.length ? list : snippets,
                from: Codemirror.Pos(line, start),
                to: Codemirror.Pos(line, end)
            }
        }, { completeSingle: false })
    }

    const renderRuleEditor = () => {
        const { name, enabled, target, script } = rule

        return (
            <>
                <div className="field">
                    <div className="label-wrapper">
                        <label>Name</label>
                    </div>
                    <input
                        type="text"
                        className="field-input name"
                        value={name || ''}
                        name="name"
                        onChange={(e) => handleChange(e)}
                    />
                </div>

                <div className="field">
                    <div className="label-wrapper">
                        <label>Target</label>
                    </div>
                    <CodeMirrorEditor
                        value={target}
                        name="target"
                        options={{
                            mode: 'javascript',
                            theme: 'darcula',
                            lineNumbers: true,
                            extraKeys: {
                                'Ctrl-Space': 'autocomplete'
                            }
                        }}
                        className={cx({ 'required-field': setErrorEditor('target') })}
                        onKeyUp={(editor, data, value) => handleTargetKeyUp({ editor, data, value })}
                        onChange={(editor, data, value) => handleChangeTarget({ editor, data, value })}
                    />
                </div>

                <div className="field">
                    <div className="label-wrapper">
                        <label>Script</label>
                    </div>
                    <CodeMirrorEditor
                        value={script}
                        options={{
                            mode: 'javascript',
                            theme: 'darcula',
                            smartIndent: true,
                            extraKeys: {
                                'Ctrl-Space': 'autocomplete'
                            }
                        }}
                        className={cx({ 'required-field': setErrorEditor('script') })}
                        onKeyUp={(editor, data, value) => handleScriptKeyUp({ editor, data, value })}
                        onChange={(editor, data, value) => handleChangeScript({ editor, data, value })}
                    />
                </div>

                <div className="editor-errors">
                    {selectedRuleData && !isEmptyArray(selectedRuleData.logs) && selectedRuleData.logs.map((err, index) => (
                        <div className="err-box" key={index}>
                            <div className="alert-item error"/>
                            {err.msg.msg}
                        </div>
                    ))}
                </div>

                <label className="checkbox-container">
                    Enable/Disable
                    <input type="checkbox" className="enable-checkbox" checked={enabled || false}
                           onChange={(event) => changeEnable(event)}/>
                    <span className="checkmark"/>
                </label>

                <div className="btn-group">
                    {selectedRule.id && <>
                        <button className="button" onClick={() => deleteRule(rule)}>Delete</button>
                        <button className="button" onClick={() => openSummary()}>Cancel</button>
                        <button className="button success" onClick={() => saveRule(rule)} disabled={validation}>Save
                        </button>
                        {isSuccess && <span>Saved!</span>}
                    </>}

                    {!selectedRule.id && <button className="button success" onClick={() => createRule(rule)}
                                                 disabled={validation}>Create</button>}

                </div>
            </>
        )
    }

    return (
        <div id="rule-editor">
            <div className="rule-container">
                {isEmptyObject(rules) && isEmptyObject(selectedRule) && renderStartPage()}
                {!isEmptyObject(selectedRule) && renderEditor()}
                {!isEmptyObject(rules) && isEmptyObject(selectedRule) &&
                <div className="no-rule">No selected rule</div>}
            </div>
        </div>
    )
}

export default Editor
