import React from 'react'
import PropertiesCounters from '../PropertiesCounters'
import PropertiesObjectList from '../PropertiesObjectList'
import PropertiesAlertList from '../PropertiesAlertList'
import EnvironmentVariables from '../EnvironmentVariables'
import DnList from '../DnList'
import Config from '../Config'
import PropertiesTable from '../PropertiesTable'

const PropertiesContents = ({ group, renderGroup }) => {
    switch (group.kind) {
        case 'counters':
            return <PropertiesCounters config={group.config} />
        case 'object-list':
            return <PropertiesObjectList config={group.config} />
        case 'alert-target-list':
            return <PropertiesAlertList config={group.config} />
        case 'key-value':
            return renderGroup(<EnvironmentVariables group={group} />)
        case 'dn-list':
            return renderGroup(<DnList group={group} />)
        case 'yaml':
            return renderGroup(<Config group={group} />)
        case 'table':
            return renderGroup(<PropertiesTable group={group} />)
        default:
            return <div>No data presented</div>
    }
}

export default PropertiesContents
