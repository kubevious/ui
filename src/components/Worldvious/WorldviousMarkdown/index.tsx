import React, { FC } from 'react';
import _ from "the-lodash"
import cx from "classnames"
import Markdown from "markdown-to-jsx"

import styles from './styles.module.css';

export interface WorldviousMarkdownProps
{
    content?: string;
}

export const WorldviousMarkdown : FC<WorldviousMarkdownProps> = ({ content }) => {

    return (
        <div className={styles.messageBlock}>
            {content && <Markdown>{content}</Markdown>}
        </div>
    )
}