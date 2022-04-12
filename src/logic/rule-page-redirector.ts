import * as H from 'history';
import { ISharedState } from '@kubevious/ui-framework';
import { navigateTo } from '@kubevious/ui-components';

import { RULE_PAGE } from '../metadata/page';

export function setupRulePageRedirector(history: H.History, sharedState: ISharedState) {
    sharedState.subscribe(
        ['rule_editor_selected_rule_id', 'focus_rule_editor'],
        ({ rule_editor_selected_rule_id, focus_rule_editor }) => {
            if (!focus_rule_editor) {
                return;
            }

            sharedState.set('focus_rule_editor', false);

            if (rule_editor_selected_rule_id) {
                sharedState.set('rule_editor_selected_rule_key', rule_editor_selected_rule_id);
            }

            if (window.location.pathname !== RULE_PAGE) {
                const searchParams = {
                };
                navigateTo(history, RULE_PAGE, searchParams, true);
            }
        },
    );
}
