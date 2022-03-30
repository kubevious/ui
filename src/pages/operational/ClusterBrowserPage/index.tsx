import { InnerPage, PageHeader, PageLinkButton } from '@kubevious/ui-components';
import React, { useEffect, useState } from 'react';

// import { useSearchQuery, useService } from '@kubevious/ui-framework';
// import { TimeMachineActive } from '@kubevious/ui-time-machine';
// import { ClusterConfig } from '@kubevious/saas-models';

import { KubeviousHandler } from '../../../components/Kubevious/logic/kubevious-handler';
import { KubeviousComponent } from '../../../components/Kubevious/KubeviousComponent';

// import { ClusterService } from '../../../services/ClusterService';

// import { useReportClusterPage } from '../../../logic/analytics';

import styles from './styles.module.css';


export const ClusterBrowserPage = () => {

    // const service = useService<ClusterService>({ kind: 'cluster' });

    useEffect(() => {
        const kubeviousHandler = new KubeviousHandler();
        return () => {
            kubeviousHandler.close();
        };
    }, []);

    return (
        <InnerPage
            fullHeight
            header={
                <PageHeader title='Cluster Browser'>
                    <div className={styles.headerInfo}>
                        {/* <TimeMachineActive /> */}
                    </div>
                </PageHeader>
            }
        >
            <KubeviousComponent />
        </InnerPage>
    );
};
