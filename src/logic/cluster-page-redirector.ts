import * as H from 'history';
import { ISharedState } from '@kubevious/ui-framework';
import { navigateTo } from '@kubevious/ui-components';

import { CLUSTER_BROWSER_PAGE } from '../metadata/page';

export function setupClusterPageRedirector(history: H.History, sharedState: ISharedState) {
    sharedState.subscribe(
        ['auto_pan_to_selected_dn'],
        ({ auto_pan_to_selected_dn }) => {
            if (!auto_pan_to_selected_dn) {
                return;
            }

            if (window.location.pathname !== CLUSTER_BROWSER_PAGE) {
                navigateTo(history, CLUSTER_BROWSER_PAGE, {}, true);
            }
        },
    );
}
