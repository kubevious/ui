import React, { FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useSharedState } from '@kubevious/ui-framework';
import { setupApiFactory } from '../configureService';

import { setupWorldvious } from "./worldvious"


import { setupClusterPageRedirector } from './cluster-page-redirector';
import { setupRulePageRedirector } from './rule-page-redirector';

import { MarkersLoader } from './markers-loader';

export const GlobalHandler: FC = () => {
    const history = useHistory();

    setupApiFactory();

    setupWorldvious();

    useSharedState((sharedState) => {
        setupClusterPageRedirector(history, sharedState);
        setupRulePageRedirector(history, sharedState);

    });

    useEffect(() => {
        const loader = new MarkersLoader();

        return () => {
            loader.close();
        }
    })

    return <></>;
};
