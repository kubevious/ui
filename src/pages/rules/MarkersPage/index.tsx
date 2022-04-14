import { BurgerMenu, Button, InnerPage, PageHeader } from '@kubevious/ui-components';
import { useSharedState } from '@kubevious/ui-framework';
import { MarkerEditor, useMarkerEditorActions } from '@kubevious/ui-rule-engine';
import React from 'react';

export const MarkersPage = () => {
    const { createNewItem, burgerMenuItems } = useMarkerEditorActions();

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
                <PageHeader title="Markers">
                    <div className="d-flex">
                        <BurgerMenu items={burgerMenuItems} />

                        <Button onClick={createNewItem} spacingLeft>
                            Add New Marker
                        </Button>
                    </div>
                </PageHeader>
            }
        >
            <MarkerEditor />
        </InnerPage>
    );
};
