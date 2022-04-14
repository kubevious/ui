import { BurgerMenu, Button, InnerPage, PageHeader } from '@kubevious/ui-components';
import { useSharedState } from '@kubevious/ui-framework';
import { RuleEditor, useRuleEditorActions } from '@kubevious/ui-rule-engine';
import React from 'react';

export const RulesPage = () => {
    const { createNewItem, burgerMenuItems } = useRuleEditorActions();

    useSharedState((sharedState) => {
        sharedState.set('need_clusters_list', true);

        return () => {
            sharedState.set('need_clusters_list', false);
        };
    });

    return (
        <InnerPage
            fullHeight
            header={
                <PageHeader title="Rules">
                    <div className="d-flex">
                        <BurgerMenu items={burgerMenuItems} />

                        <Button type="success" onClick={createNewItem} spacingLeft>
                            Add New Rule
                        </Button>
                    </div>
                </PageHeader>
            }
        >
            <RuleEditor />
        </InnerPage>
    );
};
