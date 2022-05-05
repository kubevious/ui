import { FilterMetaData } from '@kubevious/ui-search';

import { FilterSearchLabel } from '@kubevious/ui-search';
import { FilterSearchMarkers } from '@kubevious/ui-search';
import { FilterSearchWarnings } from '@kubevious/ui-search';
import { FilterSearchErrors } from '@kubevious/ui-search';
import { FilterSearchKinds } from '@kubevious/ui-search';
import { FilterSearchAnnotation } from '@kubevious/ui-search';

export const SEARCH_FILTER_METADATA: FilterMetaData[] = [
    {
        searchId: 'criteria',
        payload: 'criteria',
        title: 'criteria',
    },
    {
        searchId: 'kind',
        payload: 'kind',
        title: 'Kind',
        component: FilterSearchKinds,
    },
    {
        searchId: 'labels',
        payload: 'labels',
        title: 'Labels',
        component: FilterSearchLabel,
        isEditable: true,
    },
    {
        searchId: 'annotations',
        payload: 'annotations',
        title: 'Annotations',
        component: FilterSearchAnnotation,
        isEditable: true,
    },
    {
        searchId: 'warnings',
        payload: 'warnings',
        title: 'Warnings',
        component: FilterSearchWarnings,
    },
    {
        searchId: 'errors',
        payload: 'errors',
        title: 'Errors',
        component: FilterSearchErrors,
    },
    {
        searchId: 'markers',
        payload: 'markers',
        title: 'Markers',
        component: FilterSearchMarkers,
    },
];
