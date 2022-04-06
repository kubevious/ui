import _ from 'the-lodash';
import React from 'react';
import { ClassComponent } from '@kubevious/ui-framework';
import { SummaryState } from './types';

import styles from './styles.module.css';
import { PropertiesContents } from '@kubevious/ui-properties';
import { AgentStatusComponent } from '../AgentStatusComponent' ;

import { SectionedContent, SectionItem } from '@kubevious/ui-components';

export class Summary extends ClassComponent<{}, SummaryState> {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {
            status: null,
            data: {},
        };
    }

    componentDidMount() {

        this.subscribeToSharedState('cluster_report_status', (status) => {
            this.setState({ status });
        });

        this.subscribeToSharedState('summary', (data) => {
            this.setState({ data });
        });
    }

    render() {
        const { status, data } = this.state;

        const summarySections : SectionItem[] = [
            { title: 'Kubevious Agent', content: <AgentStatusComponent status={status} /> }
        ];

        if (data) {
            for(const group of _.values(data))
            {
                summarySections.push({ 
                    title: group.title,
                    content: <PropertiesContents group={group} />
                })
            }
        }

        return (
            <div id="summaryComponent" className={styles.summary}>
                <SectionedContent sections={summarySections} />
            </div>
        );

    }
}
