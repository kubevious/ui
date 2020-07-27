import React, { useState } from 'react'
import jsyaml from 'js-yaml'
import hljs from 'highlight.js'
import DnComponent from '../../DnComponent'
import { faDownload, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { parseDn } from '../../../utils/naming-utils';
import cx from 'classnames'

import './styles.scss'


const Config = ({ group, dn }) => {
    const [indent, setIndent] = useState(2)

    const code = jsyaml.safeDump(group.config, { indent })

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

        const blob = new Blob([code], { type: 'application/yaml'})
        const exportElem = document.getElementById('exportAnchor')
        exportElem.setAttribute('href', window.URL.createObjectURL(blob))
        exportElem.setAttribute('download', fileName)
        exportElem.click()
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

                        <button className="config-btn mr-25"><FontAwesomeIcon icon={faPencilAlt} /></button>

                        <button
                            className="config-btn download mr-25"
                            onClick={() => downloadFile()}
                        >
                            <FontAwesomeIcon icon={faDownload} />
                        </button>
                    </div>
                </div>
            </div>}
            <div className="Config-container">
                {renderCode()}
            </div>
        </>
    )
}

export default Config
