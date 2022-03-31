import React, { FC } from 'react';
import { Group } from '@kubevious/ui-properties';
import { PropertiesContents } from '@kubevious/ui-properties';
import { SectionBlock } from '../SectionBlock';

export interface SummaryBlockProps {
    group: Group;
}

export const SummaryBlock: FC<SummaryBlockProps> = ({ group }) => (

    <SectionBlock title={group.title} >
        <PropertiesContents group={group} />
    </SectionBlock>

);
