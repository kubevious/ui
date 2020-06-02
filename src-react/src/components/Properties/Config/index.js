import React from 'react'
import jsyaml from 'js-yaml'
import hljs from 'highlight.js'

import './styles.scss'
import DnComponent from '../../DnComponent'

const Config = ({ group, dn }) => {
    const code = jsyaml.safeDump(group.config)

    const renderCode = () => {
        const result = hljs.highlight(group.kind, code)

        return (
            <pre>
                <code dangerouslySetInnerHTML={{ __html: result.value }}/>
            </pre>
        )
    }
    return (
        <>
            {dn && <div className="container-header">
                <DnComponent dn={dn}/>
                <h3>Config</h3>
            </div>}
            <div className="Config-container">
                {renderCode()}
            </div>
        </>
    )
}

export default Config
