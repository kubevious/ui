import React, { FC, useState } from 'react';

import { InnerPage, PageHeader } from '@kubevious/ui-components';

import { IWorldviousService } from '@kubevious/ui-middleware';
import { WorldviousFeedbackRequest, WorldviousVersionInfoResult } from '@kubevious/ui-middleware/dist/services/worldvious';

import styles from './styles.module.css';
import { useService } from '@kubevious/ui-framework';
import { NotificationList } from '../../../components/Worldvious/NotificationList';

export const UpdatesPage: FC = () => {
    
    const [versionInfo, setVersionInfo] = useState<WorldviousVersionInfoResult | null>(null);

    const service = useService<IWorldviousService>({ kind: 'worldvious' }, 
        (svc) => {
            svc.getNotifications()
                .then(result => {
                    setVersionInfo(result);
                })
        });


    return (
        <InnerPage 
            midNarrow
            header={<PageHeader title="Updates" />}
            >

            {versionInfo &&
                <NotificationList versionInfo={versionInfo} />
            }

        </InnerPage>
    );
};
