import React from 'react'
import { Group } from '../../../types'
import { Config } from '../Config'
import { DnList } from '../DnList'
import { KeyValueList } from '../KeyValueList'
import { PropertiesAlertList } from '../PropertiesAlertList'
import { PropertiesCounters } from '../PropertiesCounters'
import { PropertiesObjectList } from '../PropertiesObjectList'
import { PropertiesTable } from '../PropertiesTable'

export const PropertiesContents = ({ group, dn }: { group: Group, dn?: string }) => {

    switch (group.kind) {
        case 'counters':
            return <PropertiesCounters config={group.config} />
        case 'object-list':
            return <PropertiesObjectList config={group.config} />
        case 'alert-target-list':
            return <PropertiesAlertList config={group.config} />
        case 'key-value':
            return <KeyValueList config={group.config} />
        case 'dn-list':
            return <DnList config={group.config} />
        case 'yaml':
            return <Config config={group.config} language={group.kind} dn={dn} />
        case 'table':
            return <PropertiesTable config={group.config} />
        default:
            return <div>No data presented</div>
    }
}
