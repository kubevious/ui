import React, { FC } from 'react';
import _ from "the-lodash"
import cx from "classnames"

import styles from './styles.module.css';

export interface WorldviousBlockProps
{
    title: string;
}

export const WorldviousBlock : FC<WorldviousBlockProps> = ({ title, children }) => {

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.headingText}>{title}</h3>
            </div>
            <div className={styles.innerContent}>
                {children}
            </div>
        </div>
    )
}