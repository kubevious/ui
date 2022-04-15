import React from 'react';
import { PropsKind } from '@kubevious/entity-meta';
import { PROPS_CONTROL_RESOLVER } from '@kubevious/ui-properties';
import { RuleAssistant } from '@kubevious/ui-rule-engine'

export function setupProperties()
{
    PROPS_CONTROL_RESOLVER.setup(PropsKind.ruleAssistant, (group) => {
        return <RuleAssistant props={group.config.props} dn={group.config.dn} />;
    })
}
