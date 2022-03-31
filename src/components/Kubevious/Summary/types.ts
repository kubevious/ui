// import { ClusterReportingStatus } from '@kubevious/saas-models';
import { Group } from '@kubevious/ui-properties';

export type SummaryState = {
    clusterId: string | null;
    status: ClusterReportingStatus | null;
    data: {
        [container: string]: Group;
    };
};



export interface ClusterReportingStatus {
    has_ready_snapshots: boolean;
    has_reported_snapshots: boolean;
    snapshots_in_queue: number;
    current_snapshot_id?: string;
    current_snapshot_date?: string;
    agent_version?: string;
    latest_snapshot_id?: string;
    latest_snapshot_date?: string;
}
