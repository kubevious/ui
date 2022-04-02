import React, { FC, ReactNode } from 'react';
import { ClusterReportingStatus } from '@kubevious/ui-middleware';

export interface AgentStatusProps {
    status?: ClusterReportingStatus | null;
    noAgentExtraInfo?: ReactNode;
}

export const AgentStatusComponent: FC<AgentStatusProps> = ({ status, noAgentExtraInfo }) => {

    if (!status) {
        return <> 
        </>;
    }

    return (
        <>
            {!status.latest_snapshot_id && (
                <>
                    <div>
                        Waiting for <strong>Kubevious Agent</strong> to report.
                        Make sure the agent is running properly.
                    </div>

                    <div>
                        If you just installed Kubevious, it may take a couple of minutes for the data to show up.
                    </div>

                    {noAgentExtraInfo}
                </>
            )}

            {status.latest_snapshot_id && !status.has_ready_snapshots && (
                <>
                    <div>
                        Receiving data from <strong>Kubevious Agent</strong>.
                    </div>
                </>
            )}

            {status.agent_version && <div>Agent Version: {status.agent_version}</div>}

            {status.current_snapshot_date && <div>Latest Report: {status.current_snapshot_date}</div>}

            {/* <pre>
                { JSON.stringify(status, null, 4) }
            </pre> */}
        </>
    );
}
