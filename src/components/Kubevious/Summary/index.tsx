import _ from 'the-lodash';
import React from 'react';
import { ClassComponent } from '@kubevious/ui-framework';
import { SummaryBlock } from '../../SummaryBlock';
import { ClusterReportingStatus, SummaryState } from './types';

import styles from './styles.module.css';
import { PageLinkButton } from '@kubevious/ui-components';

export class Summary extends ClassComponent<{}, SummaryState> {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {
            clusterId: null,
            status: null,
            data: {},
        };
    }

    componentDidMount() {
        this.subscribeToSharedState('current_cluster_id', (clusterId) => {
            this.setState({ clusterId });
        });

        this.subscribeToSharedState('current_cluster_report_status', (status) => {
            this.setState({ status });
        });

        this.subscribeToSharedState('summary', (data) => {
            this.setState({ data });
        });
    }

    private _renderStatus(status: ClusterReportingStatus) {
        status = status || {};

        return (
            <>
                {!status.latest_snapshot_id && (
                    <>
                        <div>
                            Waiting for <strong>Kubevious Agent</strong> to report. Make sure agent is running properly.
                            See agent deployment instructions below:
                        </div>

                        <div>
                            <PageLinkButton
                                type="success"
                                path="/clusters/token"
                                searchParams={{ cluster: this.state.clusterId }}
                                forceRedirect
                            >
                                Agent Deployment Instructions
                            </PageLinkButton>
                        </div>
                    </>
                )}

                {status.latest_snapshot_id && !status.has_ready_snapshots && (
                    <>
                        <div>
                            Receiving data from <strong>Kubevious Agent</strong>
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

    render() {
        const { status, data } = this.state;

        return (
            <div id="summaryComponent" className={styles.summary}>
                {/* {(status) && ( */}
                    <div className={styles.summaryContainer}>
                        <div className={styles.agentTitle}>Kubevious Agent</div>
                        <div>{this._renderStatus(status!)}</div>
                    </div>
                {/* )} */}

                {data &&
                    _.values(data).map((group, index) => <SummaryBlock key={index} group={group} />)}
            </div>
        );
    }
}
