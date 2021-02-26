import React, { useEffect, useMemo, useState } from "react"
import { Controlled as CodeMirrorEditor } from "react-codemirror2"
import cx from "classnames"
import { isEmptyArray } from "../../utils/util"
import Codemirror from "codemirror"
import { snippets } from "../../boot/targetSnippets"
import $ from "jquery"

import "codemirror/addon/hint/javascript-hint"
import "codemirror/addon/hint/show-hint"
import "codemirror/addon/hint/show-hint.css"
import "codemirror/theme/darcula.css"
import "codemirror/lib/codemirror.css"
import "codemirror/mode/javascript/javascript"
import { Log, EditorItem, RuleMainTabProps } from "./types"
import codemirror from "codemirror"

const LEFT_WINDOW_CODE_KEY = 91
const EMPTY_CODE_KEY = 64

export const RuleMainTab: React.FunctionComponent<RuleMainTabProps> = ({
    selectedItemId,
    selectedItem,
    selectedItemData,
    isSuccess,
    deleteItem,
    openSummary,
    createItem,
    saveItem,
}) => {
    const [formData, setFormData] = useState<EditorItem>({ enabled: false })
    const [formDataId, setFormDataId] = useState<string>("")
    const [visibleEditor, setVisibleEditor] = useState<string>("target")

    useEffect(() => {
        if (selectedItemId !== formDataId || selectedItemId === null) {
            setFormDataId(formDataId)
            setFormData({ ...selectedItem })
        }
    }, [selectedItemId, selectedItem])

    useEffect(() => {
        $(".editor-container").css(
            "height",
            `calc(100% - 210px - ${selectedItemData.logs.length * 40}px)`
        )
    }, [selectedItemData])

    const validation = useMemo(() => {
        return !formData.name || !formData.target || !formData.script
    }, [formData])

    const handleScriptKeyUp = ({ editor, data }: { editor: codemirror.Editor, data: KeyboardEvent}): void => {
        if (
            !editor.state.completionActive &&
            //Select only keycode letters
            data.keyCode > EMPTY_CODE_KEY &&
            data.keyCode < LEFT_WINDOW_CODE_KEY
        ) {
            //***
            // "autocomplete" is not exists in CommandActions type, but exists in Codemirror.commands
            //***
            // @ts-ignore: Unreachable code error
            Codemirror.commands.autocomplete(editor, null, {
                completeSingle: false,
            })
        }
    }

    const handleTargetKeyUp = ({ editor, data}: { editor: Codemirror.Editor, data: KeyboardEvent }): void => {
        //Select only keycode letters
        if (data.keyCode > EMPTY_CODE_KEY &&
            data.keyCode < LEFT_WINDOW_CODE_KEY) {
            showSnippets(editor)
        }
    }

    const showSnippets = (editor: Codemirror.Editor): void => {
        Codemirror.showHint(
            editor,
            function () {
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
                    to: Codemirror.Pos(line, end),
                }
            },
            { completeSingle: false }
        )
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleChangeTarget = ({
        editor,
        data,
        value,
    }: {
        editor: codemirror.Editor
        data: codemirror.EditorChange
        value: string
    }): void => {
        setFormData({ ...formData, target: value })
    }

    const handleChangeScript = ({
        editor,
        data,
        value,
    }: {
        editor: codemirror.Editor
        data: codemirror.EditorChange
        value: string
    }): void => {
        setFormData({ ...formData, script: value })
    }

    const changeEnable = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormData({ ...formData, enabled: !formData.enabled })
    }

    const { name, enabled, target, script } = formData

    const countErrors = (type: string): number =>
        selectedItemData.logs.reduce((acc = 0, item: Log) => {
            if (item.msg.source.includes(type)) {
                return (acc += 1)
            }
        }, 0) || 0

    return (
        <>
            <div className="field">
                <div className="label-wrapper">
                    <label>Name</label>
                </div>
                <input
                    type="text"
                    className="field-input name"
                    value={name || ""}
                    name="name"
                    onChange={(e) => handleChange(e)}
                />
            </div>

            <div className="editor-container">
                <div className="tabs">
                    <div
                        className={cx("tab", {
                            selected: visibleEditor === "target",
                        })}
                        onClick={() => setVisibleEditor("target")}
                    >
                        Target
                        {countErrors("target") > 0 && (
                            <div className="error-count">
                                {countErrors("target")}
                            </div>
                        )}
                    </div>

                    <div
                        className={cx("tab", {
                            selected: visibleEditor === "script",
                        })}
                        onClick={() => setVisibleEditor("script")}
                    >
                        Rule script
                        {countErrors("script") > 0 && (
                            <div className="error-count">
                                {countErrors("script")}
                            </div>
                        )}
                    </div>
                </div>

                <div className="editor">
                    {visibleEditor === "target" && (
                        <CodeMirrorEditor
                            value={target || ""}
                            options={{
                                mode: "javascript",
                                theme: "darcula",
                                lineNumbers: true,
                                extraKeys: {
                                    "Ctrl-Space": "autocomplete",
                                },
                            }}
                            onKeyUp={(editor: Codemirror.Editor, data: KeyboardEvent) =>
                                handleTargetKeyUp({ editor, data })
                            }
                            onBeforeChange={(
                                editor: codemirror.Editor,
                                data: codemirror.EditorChange,
                                value: string
                            ) => handleChangeTarget({ editor, data, value })}
                        />
                    )}

                    {visibleEditor === "script" && (
                        <CodeMirrorEditor
                            value={script || ""}
                            options={{
                                mode: "javascript",
                                theme: "darcula",
                                lineNumbers: true,
                                extraKeys: {
                                    "Ctrl-Space": "autocomplete",
                                },
                            }}
                            onKeyUp={(editor: Codemirror.Editor, data: KeyboardEvent) =>
                                handleScriptKeyUp({ editor, data })
                            }
                            onBeforeChange={(
                                editor: codemirror.Editor,
                                data: codemirror.EditorChange,
                                value: string
                            ) => handleChangeScript({ editor, data, value })}
                        />
                    )}
                </div>
            </div>

            <div className="editor-errors">
                {selectedItemData &&
                    !isEmptyArray(selectedItemData.logs) &&
                    selectedItemData.logs.map((err, index) => (
                        <>
                            {
                                <div className="err-box" key={index}>
                                    <div className="alert-item error" />
                                    {err.msg.msg}
                                </div>
                            }
                        </>
                    ))}
            </div>

            <label className="checkbox-container">
                {enabled ? "Enable" : "Disable"}
                <input
                    type="checkbox"
                    className="enable-checkbox"
                    checked={enabled || false}
                    onChange={(e) => changeEnable(e)}
                />
                <span id="checkmark" className="checkmark" />
            </label>

            <div className="btn-group">
                {selectedItem.name && (
                    <>
                        <button
                            className="button"
                            onClick={() => deleteItem(formData)}
                        >
                            Delete
                        </button>
                        <button
                            className="button"
                            onClick={() => openSummary()}
                        >
                            Cancel
                        </button>
                        <button
                            className="button success"
                            onClick={() => saveItem(formData)}
                            disabled={validation}
                        >
                            Save
                        </button>
                        {isSuccess && <span>Saved!</span>}
                    </>
                )}

                {!selectedItem.name && (
                    <>
                        <button
                            className="button"
                            onClick={() => openSummary()}
                        >
                            Cancel
                        </button>
                        <button
                            className="button success rule"
                            onClick={() => createItem(formData)}
                            disabled={validation}
                        >
                            Create
                        </button>
                    </>
                )}
            </div>
        </>
    )
}
