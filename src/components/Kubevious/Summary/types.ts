import { ClusterReportingStatus } from '@kubevious/ui-middleware';
// import { Group } from '@kubevious/ui-properties';
// import { SnapshotPropsConfig } from '@kubevious/state-registry';

export type SummaryState = {
    status: ClusterReportingStatus | null;
    data: {
        [container: string]: any; //Group; // TODO: Fix me
    };
};

