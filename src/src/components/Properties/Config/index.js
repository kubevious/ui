import React, { useEffect, useState } from 'react'
import jsyaml from 'js-yaml'
import hljs from 'highlight.js'
import DnComponent from '../../DnComponent'
import { faCheck, faDownload, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames'
import { Controlled as CodeMirrorEditor } from 'react-codemirror2'
import { faClone as farClone } from '@fortawesome/free-regular-svg-icons'
import _ from 'the-lodash'

import './styles.scss'

import 'codemirror/theme/darcula.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/yaml/yaml'


const Config = ({ group, dn }) => {
    const [indent, setIndent] = useState(2)
    const [editMode, setEditMode] = useState(false)

    const [code, setCode] = useState(jsyaml.safeDump(group.config, { indent }))
    const [editedConfig, setEditedConfig] = useState(code)

    const [configCopied, setConfigCopied] = useState(false)
    const [commandCopied, setCommandCopied] = useState(false)

    const [fileName, setFileName] = useState('config.yaml')
    const [kubectlCommand, setKubectlCommand] = useState('')

    useEffect(() => {

        var namespace = _.get(group.config, 'metadata.namespace');
        var nameParts = [];
        nameParts.push(_.get(group.config, 'kind'));
        nameParts.push(namespace);
        nameParts.push(_.get(group.config, 'metadata.name'));
        nameParts = nameParts.filter(x => x);

        if (nameParts.length == 0) {
            nameParts.push('config');
        }

        nameParts = nameParts.map(x => x.toLocaleLowerCase());

        let fn = nameParts.join('-') + '.yaml';
        setFileName(fn)

        var command = `kubectl apply -f ${fn}`;
        if (namespace) {
            command = command + ` -n ${namespace}`;
        }
        setKubectlCommand(command)
    }, [])

    useEffect(() => {
        setCode(jsyaml.safeDump(group.config, { indent }))
        setEditedConfig(jsyaml.safeDump(jsyaml.load(editedConfig), { indent }))
    }, [indent])

    const handleEditedMode = () => {
        setEditMode(!editMode)

        if (!editMode) {
            let conf = group.config
            _.unset(conf, ['metadata', 'uid'])
            _.unset(conf, ['metadata', 'selfLink'])
            _.unset(conf, ['metadata', 'resourceVersion'])
            _.unset(conf, ['metadata', 'generation'])
            _.unset(conf, ['metadata', 'creationTimestamp'])
            _.unset(conf, ['status'])

            setEditedConfig(jsyaml.safeDump(conf, { indent }))
        }
    }

    const renderCode = () => {
        const result = hljs.highlight(group.kind, code)

        return (
            <pre>
                <code dangerouslySetInnerHTML={{ __html: result.value }} />
            </pre>
        )
    }

    const downloadFile = () => {
        const blob = new Blob([editMode ? editedConfig : code], { type: 'application/yaml' })
        const exportElem = document.getElementById('exportAnchor')
        exportElem.setAttribute('href', window.URL.createObjectURL(blob))
        exportElem.setAttribute('download', fileName)
        exportElem.click()
    }

    const handleChangeConfig = ({ editor, data, value }) => {
        setEditedConfig(value)
    }

    const copyText = (type) => {
        let copiedText = ''
        switch (type) {
            case 'config':
                copiedText = code
                break
            case 'command':
                copiedText = kubectlCommand
                break
        }

        const textField = document.createElement('textarea')
        textField.innerText = copiedText
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        type === 'config' ? setConfigCopied(true) : setCommandCopied(true)
        textField.remove()

        setTimeout(() => {
            type === 'config' ? setConfigCopied(false) : setCommandCopied(false)
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
                            onClick={() => handleEditedMode()}
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
                    <FontAwesomeIcon className="copy-icon" icon={farClone} onClick={() => copyText('config')} />
                }

                {!editMode && renderCode()}

                {editMode && <CodeMirrorEditor
                    value={editedConfig}
                    name="editedConfig"
                    options={{
                        mode: 'yaml',
                        theme: 'darcula',
                    }}
                    onBeforeChange={(editor, data, value) => handleChangeConfig({ editor, data, value })}
                />}
            </div>

            {editMode && <div className="footer">
                $ {kubectlCommand}

                <div className="icon-wrapper">
                    {commandCopied && <div className="copied-container">
                        Copied to clipboard
                        <div className="caret" />
                    </div>}
                    <FontAwesomeIcon icon={farClone} onClick={() => copyText('command')} />
                </div>
            </div>}
        </>
    )
}

export default Config
