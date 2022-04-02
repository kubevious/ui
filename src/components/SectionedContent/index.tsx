import React, { FC, ReactNode } from 'react';
import { SectionBlock } from '../SectionBlock';

import styles from './styles.module.css';

export interface SectionItem {
    title: ReactNode,
    content: ReactNode
} 

export interface SectionedContentProps {
    sections: SectionItem[]
}

export const SectionedContent: FC<SectionedContentProps> = ({ sections }) => (
    <div className={styles.sectionedContent}>

        {sections.map((section, index) => 

            <div key={index} className={styles.section}>

                <SectionBlock title={section.title}>
                    {section.content}
                </SectionBlock>

            </div>
        
        )}
    </div>
);
