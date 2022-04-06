import React, { FC } from 'react';
import Markdown from "markdown-to-jsx"
import _ from "the-lodash"
import { isEmptyArray } from "../../../utils/util"

import { WorldviousNewVersionInfo } from '@kubevious/ui-middleware/dist/services/worldvious'

import "./styles.scss"

export interface NewVersionProps
{
    item : WorldviousNewVersionInfo;
}

export const NewVersion : FC<NewVersionProps> = ({ item }) => {
    let version = item.version
    if (!_.startsWith(version, "v")) {
        version = "v" + version
    }
    return (
        <div className="separate-container new-version-inner">
            <h3>
                {item.name} ({version}) Available!
            </h3>
            <a
                href={item.url}
                target="_blank"
                className="install-btn button success"
            >
                Install Now
            </a>
            <div>
                or visit:
                <a href={item.url} target="_blank" className="target-link">
                    {item.url}
                </a>
            </div>
            {item.features && !isEmptyArray(item.features) && (
                <>
                    <h3>Features</h3>
                    <ul>
                        {item.features.map((elem, index) => (
                            <li key={index}>{elem}</li>
                        ))}
                    </ul>
                </>
            )}
            {item.changes && !isEmptyArray(item.changes) && (
                <>
                    <h3>Changes</h3>
                    <ul>
                        {item.changes.map((elem, index) => (
                            <li key={index}>{elem}</li>
                        ))}
                    </ul>
                </>
            )}
            {item.content && <Markdown>{item.content}</Markdown>}
        </div>
    )
}
