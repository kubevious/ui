import React, { FC } from 'react';

import { InnerPage, PageHeader, SectionedContent } from '@kubevious/ui-components';
import { LargeLogo } from '../../../components/LargeLogo';
import { SocialLinks } from '../../../components/SocialLinks';
import { BackendMetrics } from '../../../components/BackendMetrics';

import styles from './styles.module.css';

export const AboutPage: FC = () => {

    return (
        <InnerPage 
            midNarrow
            header={<PageHeader title="About" />}
            >

            <div className={styles.content}>
                
                <LargeLogo />

                <SocialLinks />

                <SectionedContent
                    sections={[{
                        title: 'Internal Metrics',
                        content: <BackendMetrics />
                    }]}
                    />
                

            </div>


        </InnerPage>
    );
};
