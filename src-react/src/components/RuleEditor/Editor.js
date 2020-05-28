import React, { useEffect, useMemo, useState } from 'react'
import { isEmptyArray, isEmptyObject } from '../../utils/util'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import cx from 'classnames'
import DnShortcutComponent from '../DnShortcutComponent'

const Editor = ({ rules, isNewRule, selectedRule, selectedRuleData, createNewRule, saveRule, deleteRule, createRule, openSummary, state, isSuccess }) => {
    const [selectedTab, setSelectedTab] = useState('rule')
    const [rule, setRule] = useState({ name: '' })

    useEffect(() => {
        setRule({ ...selectedRule })
    }, [selectedRule, selectedRuleData])

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
                        value={name}
                        name="name"
                        onChange={(e) => handleChange(e)}
                    />
                </div>

                <div className="field">
                    <div className="label-wrapper">
                        <label>Target</label>
                    </div>
                    <CodeMirror
                        value={target}
                        name="target"
                        options={{
                            mode: 'javascript',
                            theme: 'darcula',
                            lineNumbers: true
                        }}
                        className={cx({ 'required-field': setErrorEditor('target') })}
                        onChange={(editor, data, value) => handleChangeTarget({ editor, data, value })}
                    />
                </div>

                <div className="field">
                    <div className="label-wrapper">
                        <label>Script</label>
                    </div>
                    <CodeMirror
                        value={script}
                        options={{
                            mode: 'javascript',
                            theme: 'darcula',
                            lineNumbers: true

                        }}
                        className={cx({ 'required-field': setErrorEditor('script') })}
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
                    <input type="checkbox" className="enable-checkbox" checked={enabled}
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
