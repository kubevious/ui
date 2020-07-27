import React, { useEffect, useState } from 'react'
import jsyaml from 'js-yaml'
import hljs from 'highlight.js'
import DnComponent from '../../DnComponent'
import { faCheck, faDownload, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { parseDn } from '../../../utils/naming-utils';
import cx from 'classnames'
import { Controlled as CodeMirrorEditor } from 'react-codemirror2'
import { faClone as farClone } from '@fortawesome/free-regular-svg-icons'

import './styles.scss'

import 'codemirror/theme/darcula.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/yaml/yaml'


const Config = ({ group, dn }) => {
    const [indent, setIndent] = useState(2)
    const [editMode, setEditMode] = useState(false)

    const code = jsyaml.safeDump(group.config, { indent })
    const [editedConfig, setEditedConfig] = useState(code)

    useEffect(() => {
        setEditedConfig(jsyaml.safeDump(group.config, { indent }))
    }, [indent])

    const [configCopied, setConfigCopied] = useState(false)
    const [commandCopied, setCommandCopied] = useState(false)

    const renderCode = () => {
        const result = hljs.highlight(group.kind, code)

        return (
            <pre>
                <code dangerouslySetInnerHTML={{ __html: result.value }} />
            </pre>
        )
    }

    const downloadFile = () => {
        const namespace = parseDn(dn).find(item => item.kind === 'ns').name
        const fileName = namespace ? `${namespace}.yaml` : `config.yaml`

        const blob = new Blob([editMode ? editedConfig : code], { type: 'application/yaml' })
        const exportElem = document.getElementById('exportAnchor')
        exportElem.setAttribute('href', window.URL.createObjectURL(blob))
        exportElem.setAttribute('download', fileName)
        exportElem.click()
    }

    const handleChangeConfig = ({ editor, data, value }) => {
        setEditedConfig(value)
    }

    const copyConfig = () => {
        const textField = document.createElement('textarea')
        textField.innerText = code
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        setConfigCopied(true)
        textField.remove()

        setTimeout(() => {
            setConfigCopied(false)
        }, 3000)
    }

    const copyCommand = () => {
        const textField = document.createElement('textarea')
        textField.innerText = 'kubectl apply -f my-file.yaml -n book'
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        setCommandCopied(true)
        textField.remove()

        setTimeout(() => {
            setCommandCopied(false)
        }, 3000)
    }


    return (
        <>
            {dn && <div className="Config-header">
                <div className="cluster">
                    <DnComponent dn={dn} />
                </div>

                <div className="header">
                    <a id='exportAnchor' style={{ display: 'none' }} />
                    <h3>Config</h3>
                    <div className="buttons-group">
                        <span className="tab-label">
                            Tab Size
                        </span>

                        <button
                            className={cx('config-btn', { 'selected': indent === 2 })}
                            onClick={() => setIndent(2)}
                        >
                            2
                        </button>

                        <button
                            className={cx('config-btn mr-25', { 'selected': indent === 4 })}
                            onClick={() => setIndent(4)}
                        >
                            4
                        </button>

                        <button
                            className={cx('config-btn mr-25', { 'selected': editMode })}
                            onClick={() => setEditMode(!editMode)}
                        >
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </button>

                        <button
                            className="config-btn download mr-25"
                            onClick={() => downloadFile()}
                        >
                            <FontAwesomeIcon icon={faDownload} />
                        </button>
                    </div>
                </div>
            </div>}

            <div className={cx('Config-container', { 'edit-mode': editMode })}>
                {configCopied ? <FontAwesomeIcon className="copy-icon" icon={faCheck} /> :
                    <FontAwesomeIcon className="copy-icon" icon={farClone} onClick={() => copyConfig()} />
                }

                {!editMode && renderCode()}

                {editMode && <CodeMirrorEditor
                    value={editedConfig}
                    name="code"
                    options={{
                        mode: 'yaml',
                        theme: 'darcula',
                    }}
                    onBeforeChange={(editor, data, value) => handleChangeConfig({ editor, data, value })}
                />}
            </div>

            {editMode && <div className="footer">
                $ kubectl apply -f my-file.yaml -n book

                <div className="icon-wrapper">
                    {commandCopied && <div className="copied-container">
                        Copied to clipboard
                        <div className="caret" />
                    </div>}
                    <FontAwesomeIcon icon={farClone} onClick={() => copyCommand()} />
                </div>
            </div>}
        </>
    )
}

export default Config
