import React from 'react'
import Markdown from 'markdown-to-jsx'
import _ from 'the-lodash'
import { isEmptyArray } from '../../utils/util'

import './styles.scss'

export const NewVersion = ({ info }) => {
    let version = info.version
    if (!_.startsWith(version, 'v')) {
        version = 'v' + version
    }
    return (
        <div className="separate-container new-version-inner">
            <h3>
                {info.name} ({version}) Available!
            </h3>
            <a
                href={info.url}
                target="_blank"
                className="install-btn button success"
            >
                Install Now
            </a>
            <div>
                or visit:
                <a href={info.url} target="_blank" className="target-link">
                    {info.url}
                </a>
            </div>
            {info.features && !isEmptyArray(info.features) && (
                <>
                    <h3>Features</h3>
                    <ul>
                        {info.features.map((elem, index) => (
                            <li key={index}>{elem}</li>
                        ))}
                    </ul>
                </>
            )}
            {info.changes && !isEmptyArray(info.changes) && (
                <>
                    <h3>Changes</h3>
                    <ul>
                        {info.changes.map((elem, index) => (
                            <li key={index}>{elem}</li>
                        ))}
                    </ul>
                </>
            )}
            {info.content && <Markdown>{info.content}</Markdown>}
        </div>
    )
}
