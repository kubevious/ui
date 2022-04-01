import { ClusterReportingStatus } from '@kubevious/ui-middleware';
import { Group } from '@kubevious/ui-properties';

export type SummaryState = {
    clusterId: string | null;
    status: ClusterReportingStatus | null;
    data: {
        [container: string]: Group;
    };
};

