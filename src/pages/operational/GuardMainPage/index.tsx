import React from 'react';
import { AdditionalBlock, CodeControl, PageLink } from '@kubevious/ui-components'
import { GuardMainPage as BaseGuardMainPage } from '@kubevious/ui-guard'

export const GuardMainPage = () => {

    const sampleCommand = 
        "$ cat manifests.yaml | sh <(curl -sfL https://run.kubevious.io/validate.sh)\n" + 
        "$ kubectl apply -f manifests.yaml"
        ;

    return (
        <BaseGuardMainPage header={
            <AdditionalBlock>
                
                Kubevious Guard can validates changes from CI/CD pipelines
                before they have a chance to negatively affect Kubernetes 
                cluster and applications.

                <CodeControl value={sampleCommand}
                             syntax="shell"/>

                <PageLink path="https://kubevious.io/docs/guard" 
                          name="Learn more about Kubevious Guard.">
                </PageLink>

            </AdditionalBlock>
        }/>
    );
};
