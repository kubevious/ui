import React, { FC, ReactNode } from 'react';
import styles from './styles.module.css';

export interface SectionBlockProps {
    title: ReactNode
}

export const SectionBlock: FC<SectionBlockProps> = ({ title, children }) => (
    <div className={styles.section}>
        <div className={styles.title}>{title}</div>
        { children }
    </div>
);
