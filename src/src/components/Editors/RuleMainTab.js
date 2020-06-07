import React, { useEffect, useMemo, useState } from 'react'
import { Controlled as CodeMirrorEditor } from 'react-codemirror2'
import cx from 'classnames'
import { isEmptyArray } from '../../utils/util'
import Codemirror from 'codemirror'
import { snippets } from '../../boot/targetSnippets'

import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/theme/darcula.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'

const RuleMainTab = ({ selectedItemId, selectedItem, selectedItemData, isSuccess, deleteItem, openSummary, createItem, saveItem }) => {

    const [formData, setFormData] = useState({})
    const [formDataId, setFormDataId] = useState(null)

    useEffect(() => {
        if (selectedItemId !== formDataId) {
            setFormDataId(formDataId)
            setFormData({ ...selectedItem })
        }
    }, [selectedItemId, selectedItem])

    const validation = useMemo(() => formData.name === '', [formData])

    const setErrorEditor = (field) => {
        return selectedItemData.logs.find(item => item.msg.source.includes(field)) &&
            selectedItemData.logs.find(item => item.msg.source.includes(field)).length !== 0
    }

    const handleScriptKeyUp = ({ editor, data, value }) => {
        if (!editor.state.completionActive && data.keyCode > 64 && data.keyCode < 91) {
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleChangeTarget = ({ editor, data, value }) => {
        setFormData({ ...formData, target: value })
    }

    const handleChangeScript = ({ editor, data, value }) => {
        setFormData({ ...formData, script: value })
    }

    const changeEnable = (e) => {
        setFormData({ ...formData, enabled: !formData.enabled })
    }

    const { name, enabled, target, script } = formData

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
                    onBeforeChange={(editor, data, value) => handleChangeTarget({ editor, data, value })}
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
                    onBeforeChange={(editor, data, value) => handleChangeScript({ editor, data, value })}
                />
            </div>

            <div className="editor-errors">
                {selectedItemData && !isEmptyArray(selectedItemData.logs) && selectedItemData.logs.map((err, index) => (
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
                {selectedItem.id && <>
                    <button className="button" onClick={() => deleteItem(formData)}>Delete</button>
                    <button className="button" onClick={() => openSummary()}>Cancel</button>
                    <button className="button success" onClick={() => saveItem(formData)} disabled={validation}>Save
                    </button>
                    {isSuccess && <span>Saved!</span>}
                </>}

                {!selectedItem.id && <button className="button success" onClick={() => createItem(formData)}
                                             disabled={validation}>Create</button>}

            </div>
        </>
    )
}

export default RuleMainTab