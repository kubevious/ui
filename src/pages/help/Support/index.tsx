import React, { FC } from 'react';

import { InnerPage, Label, PageHeader, PageLink, PageLinkButton } from '@kubevious/ui-components';
import { GITHUB_SUBMIT_ISSUE_URL } from '../../../metadata/social';

import styles from './styles.module.css';

export const SupportPage: FC = () => {

    return (
        <InnerPage 
            narrow
            header={<PageHeader title="Need Help?" />}
            >

            <div className={styles.emailContainer}>
                <Label text="Something not working? Submit a bug request." />
                <PageLink name={GITHUB_SUBMIT_ISSUE_URL} 
                          path={GITHUB_SUBMIT_ISSUE_URL}
                          target="_blank"
                          />
            </div>

            <hr />

            <div className={styles.slackContainer}>
                <Label text="Talk to us and our community in Slack" />
                <PageLinkButton path="https://kubevious.io/slack"
                                target="_blank"
                                >
                    Join our Slack channel
                </PageLinkButton>
            </div>

            <hr />

            <div className={styles.emailContainer}>
                <Label text="You can also reach out to our team at" />
                <PageLink name="support@kubevious.io" 
                          path="mailto:support@kubevious.io"
                          />
            </div>

        </InnerPage>
    );
};
