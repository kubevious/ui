import React, { useEffect, useState } from 'react'
import jsyaml from 'js-yaml'
import hljs from 'highlight.js'
import { faDownload, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames'
import { Controlled as CodeMirrorEditor } from 'react-codemirror2'
import _ from 'the-lodash'

import './styles.scss'

import 'codemirror/theme/darcula.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/yaml/yaml'
import { CopyClipboard, DnComponent } from '@kubevious/ui-components';
import { Annotations } from './types';
import { Editor, EditorChange } from 'codemirror';
import { sharedState } from '../../../configureService';

export const Config = ({ config, dn, language }: { config: Annotations, dn: string, language?: string }) => {
    const [indent, setIndent] = useState<number>(2)
    const [editMode, setEditMode] = useState<boolean>(false)

    const [code, setCode] = useState<string>(jsyaml.safeDump(config, { indent }))
    const [editedConfig, setEditedConfig] = useState<string>(code)

    const [fileName, setFileName] = useState<string>('config.yaml')
    const [kubectlCommand, setKubectlCommand] = useState<string>('')

    useEffect(() => {
        const namespace: string = _.get(config, 'metadata.namespace');
        let nameParts: string[] = [];
        nameParts.push(_.get(config, 'kind'));
        nameParts.push(namespace);
        nameParts.push(_.get(config, 'metadata.name'));
        nameParts = nameParts.filter(x => x);

        if (nameParts.length === 0) {
            nameParts.push('config');
        }

        nameParts = nameParts.map(x => x.toLocaleLowerCase());

        let fn = nameParts.join('-') + '.yaml';
        setFileName(fn)

        let command = `kubectl apply -f ${fn}`;
        if (namespace) {
            command = command + ` -n ${namespace}`;
        }
        setKubectlCommand(command)
    }, [])

    useEffect(() => {
        try {
            setCode(jsyaml.safeDump(config, { indent }))
            setEditedConfig(jsyaml.safeDump(jsyaml.load(editedConfig), { indent }))
        } catch (error) {
            sharedState.set('is_error', true)
            sharedState.set('error', { data: error })
        }
    }, [indent, config])

    const handleEditedMode = (): void => {
        setEditMode(!editMode)

        const PATHS_TO_UNSET = [
            'metadata.uid',
            'metadata.selfLink',
            'metadata.resourceVersion',
            'metadata.generation',
            'metadata.creationTimestamp',
            'metadata.managedFields',
            'status'
        ]

        if (!editMode) {
            const conf = _.cloneDeep(config)
            for(let p of PATHS_TO_UNSET)
            {
                _.unset(conf, p);
            }
            setEditedConfig(jsyaml.safeDump(conf, { indent }))
        }
    }

    const renderCode = (): JSX.Element => {
        const result = language ? hljs.highlight(language, code) : ''

        return (
            <pre>
                {result && result.value && <code dangerouslySetInnerHTML={{ __html: result.value }} />}
            </pre>
        )
    }

    const downloadFile = (): void => {
        const blob = new Blob([editMode ? editedConfig : code], { type: 'application/yaml' })
        const exportElem = document.getElementById('exportAnchor')
        exportElem?.setAttribute('href', window.URL.createObjectURL(blob))
        exportElem?.setAttribute('download', fileName)
        exportElem?.click()
    }

    const handleChangeConfig = ({ editor, data, value }: {editor: Editor, data: EditorChange, value: string}): void => {
        setEditedConfig(value)
    }

    return (
        <div className="Config-wrapper">
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
                            title="Set tab size to 2 spaces"
                        >
                            2
                        </button>

                        <button
                            className={cx('config-btn mr-25', { 'selected': indent === 4 })}
                            onClick={() => setIndent(4)}
                            title="Set tab size to 4 spaces"
                        >
                            4
                        </button>

                        <button
                            className={cx('config-btn mr-25', { 'selected': editMode })}
                            onClick={() => handleEditedMode()}
                            title={`${editMode ? 'Disable' : 'Enable'} configuration editor`}
                        >
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </button>

                        <button
                            className="config-btn download mr-25"
                            onClick={() => downloadFile()}
                            title="Download"
                        >
                            <FontAwesomeIcon icon={faDownload} />
                        </button>
                    </div>
                </div>
            </div>}

            <div className={cx('Config-container', { 'edit-mode': editMode })}>
                <CopyClipboard text={editMode ? editedConfig : code} />

                {!editMode && renderCode()}

                {editMode && <CodeMirrorEditor
                    value={editedConfig}
                    options={{
                        mode: 'yaml',
                        theme: 'darcula',
                    }}
                    onBeforeChange={(editor: Editor, data: EditorChange, value: string) => handleChangeConfig({ editor, data, value })}
                />}
            </div>

            {editMode && <div className="footer">
                <span className="run-command">$ {kubectlCommand}</span>

                <CopyClipboard text={kubectlCommand} />
            </div>}
        </div>
    )
}
