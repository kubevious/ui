import React from 'react';
import { InnerPage, PageHeader } from '@kubevious/ui-components';
import { useSharedState } from '@kubevious/ui-framework';

import { Search } from '@kubevious/ui-search';
import { SEARCH_FILTER_METADATA } from './search-metadata';

export const SearchPage = () => {

    useSharedState((sharedState) => {
        sharedState.set("need_clusters_list", true);
    
        return () => {
            sharedState.set("need_clusters_list", false);
        }
    });
    
    return (
        <InnerPage header={<PageHeader title="Search" />} fullHeight>
            <Search filterList={SEARCH_FILTER_METADATA} />
        </InnerPage>
    );
};
