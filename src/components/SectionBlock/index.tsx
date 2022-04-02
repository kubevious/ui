import React, { FC, ReactNode } from 'react';
import styles from './styles.module.css';
import { Label } from '@kubevious/ui-components'

export interface SectionBlockProps {
    title: ReactNode
}

export const SectionBlock: FC<SectionBlockProps> = ({ title, children }) => (
    <div className={styles.section}>
        <Label className={styles.title}
               size="xlarge"
               color="faded"
                >
            {title}
        </Label> 
        { children }
    </div>
);
