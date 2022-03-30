import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import { useSharedState } from '@kubevious/ui-framework';
import { setupApiFactory } from '../configureService';

// import { setupClusterPageRedirector } from './cluster-page-redirector';
// import { setupRulePageRedirector } from './rule-page-redirector';

export const GlobalHandler: FC = () => {
    const history = useHistory();

    setupApiFactory();

    useSharedState((sharedState) => {
        // setupClusterPageRedirector(history, sharedState);
        // setupRulePageRedirector(history, sharedState);
    });

    return <></>;
};
