import React, { useEffect } from 'react';
import { InnerPage, PageHeader } from '@kubevious/ui-components';

import { TimeMachineActive } from '@kubevious/ui-time-machine';

import { KubeviousHandler } from '../../../components/Kubevious/logic/kubevious-handler';
import { KubeviousComponent } from '../../../components/Kubevious/KubeviousComponent';

import styles from './styles.module.css';


export const ClusterBrowserPage = () => {

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
                        <TimeMachineActive />
                    </div>
                </PageHeader>
            }
        >
            <KubeviousComponent />
        </InnerPage>
    );
};
