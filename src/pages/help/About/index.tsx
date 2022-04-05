import React, { FC } from 'react';

import { InnerPage, Label, PageHeader, PageLink, PageLinkButton } from '@kubevious/ui-components';
import { LargeLogo } from '../../../components/LargeLogo';

import styles from './styles.module.css';

export const AboutPage: FC = () => {

    return (
        <InnerPage 
            narrow
            header={<PageHeader title="About" />}
            >

            <LargeLogo />


        </InnerPage>
    );
};
