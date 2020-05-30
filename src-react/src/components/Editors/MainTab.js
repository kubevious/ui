import React, { useEffect, useMemo, useState } from 'react'
import { Controlled as CodeMirrorEditor } from 'react-codemirror2'
import cx from 'classnames'
import { isEmptyArray } from '../../utils/util'
import { COLORS, SHAPES } from '../../boot/markerData'
import { ChromePicker } from 'react-color'
import Codemirror from 'codemirror'
import { snippets } from '../../boot/targetSnippets'

const MainTab = ({ type, selectedItemId, selectedItem, selectedItemData, isSuccess, deleteItem, openSummary, createItem, saveItem }) => {
    const [displayColorPicker, setDisplayColorPicker] = useState(false)
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

    const handleChangeShape = (shape) => {
        setFormData({ ...formData, shape: shape })
    }

    const handleChangeColor = (color) => {
        setFormData({ ...formData, color: color })
    }

    const renderRuleEditor = () => {
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
            </>
        )
    }

    const renderMarkerEditor = () => {
        const { name, color, shape } = formData

        const popover = {
            position: 'absolute',
            zIndex: '100'
        }
        const cover = {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px'
        }

        return (
            <>
                <div className="field">
                    <div className="label-wrapper">
                        <label>Name</label>
                    </div>
                    <div className={`marker-shape ${shape}`} style={{ backgroundColor: color }} />
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
                        <label>Shape</label>
                    </div>
                    <div className="marker-area">
                        {SHAPES.map(item => (
                            <div key={item} className={`marker-shape ${item}`} style={{ backgroundColor: color }}
                                 onClick={() => handleChangeShape(item)}/>
                        ))}
                    </div>
                </div>

                <div className="field">
                    <div className="label-wrapper">
                        <label>Color</label>
                    </div>
                    <div className="marker-area">
                        {COLORS.map(item => (
                            <div key={item} className={`marker-shape ${shape}`} style={{ backgroundColor: item }}
                                 onClick={() => handleChangeColor(item)}/>
                        ))}
                    </div>

                    <button className="custom-color" onClick={() => setDisplayColorPicker(!displayColorPicker)}>Pick
                        Color
                    </button>
                    {displayColorPicker && <div style={popover}>
                        <div style={cover} onClick={() => setDisplayColorPicker(false)}/>
                        <ChromePicker onChange={(color, event) => handleChangeColor(color.hex)} color={color}/>
                    </div>}
                </div>

            </>
        )
    }

    return (
        <>
            {type === 'rule' ? renderRuleEditor() : renderMarkerEditor()}
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

export default MainTab