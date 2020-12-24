import React from 'react'
import PropertiesCounters from '../PropertiesCounters'
import PropertiesObjectList from '../PropertiesObjectList'
import PropertiesAlertList from '../PropertiesAlertList'

const PropertiesContents = ({ group }) => {
    switch (group.kind) {
        case 'counters':
            return <PropertiesCounters config={group.config} />
        case 'object-list':
            return <PropertiesObjectList config={group.config} />
        case 'alert-target-list':
            return <PropertiesAlertList config={group.config} />
        default:
            return <div>No data presented</div>
    }
}

export default PropertiesContents
