import React, { FC } from 'react';
import { WorldviousMarkdown } from "../WorldviousMarkdown"
import _ from "the-lodash"
import { isEmptyArray } from "../../../utils/util"

import { WorldviousNewVersionInfo } from '@kubevious/ui-middleware/dist/services/worldvious'
import { WorldviousBlock } from '../WorldviousBlock';

import styles from './styles.module.css';
import { PageLink, PageLinkButton } from '@kubevious/ui-components/dist';

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
        <WorldviousBlock title={`${item.name} (${version}) Available!`}>

            <div className={styles.installContainer}>
                <PageLinkButton path={item.url} target="_blank">
                Install Now
                </PageLinkButton>

                or visit:
                
                <PageLink path={item.url} target="_blank"> 
                    {item.url}
                </PageLink>
            </div>

            {item.features && !isEmptyArray(item.features) && (
                <div className={styles.section}>
                    <h3>Features</h3>
                    <ul>
                        {item.features.map((elem, index) => (
                            <li key={index}>{elem}</li>
                        ))}
                    </ul>
                </div>
            )}
            {item.changes && !isEmptyArray(item.changes) && (
                <div className={styles.section}>
                    <h3>Changes</h3>
                    <ul>
                        {item.changes.map((elem, index) => (
                            <li key={index}>{elem}</li>
                        ))}
                    </ul>
                </div>
            )}

            <WorldviousMarkdown content={item.content} />

        </WorldviousBlock>
    )
}
