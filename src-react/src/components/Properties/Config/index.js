import React from 'react'
import jsyaml from 'js-yaml'
import hljs from 'highlight.js'

import './styles.scss'

const Config = ({ group }) => {
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
        <div className="Config-container">
                {renderCode()}
        </div>
    )
}

export default Config
