import React, { FC } from 'react';

import { InnerPage, PageHeader } from '@kubevious/ui-components';

import styles from './styles.module.css';

export const UpdatesPage: FC = () => {

    return (
        <InnerPage 
            midNarrow
            header={<PageHeader title="Updates" />}
            >


        </InnerPage>
    );
};
