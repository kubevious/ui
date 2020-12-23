import React from 'react'
import PropertyGroup from '../PropertyGroup'
import EnvironmentVariables from '../EnvironmentVariables'
import DnList from '../DnList'
import Config from '../Config'
import PropertiesTable from '../PropertiesTable'
import PropertiesCounters from '../PropertiesCounters'
import PropertiesObjectList from '../PropertiesObjectList'
import PropertiesAlertList from '../PropertiesAlertList'

const PropertiesContents = ({ group, ...rest }) => {
    console.log('contents>>>', rest, ' GROUP >>>>>>>>', group)
    if (group.kind === 'key-value') {
        // if (group.id === 'env') {
        //     rest.options.keyLabel = 'Variable'
        // }

        return (
            <PropertyGroup
                Component={<EnvironmentVariables group={group} />}
                group={group}
                props={rest}
            />
        )
    } else if (group.kind === 'dn-list') {
        return (
            <PropertyGroup
                Component={<DnList group={group} />}
                group={group}
                props={rest}
            />
        )
    } else if (group.kind === 'yaml') {
        return (
            <PropertyGroup
                Component={<Config group={group} />}
                group={group}
                props={rest}
            />
        )
    } else if (group.kind === 'table') {
        return (
            <PropertyGroup
                Component={<PropertiesTable group={group} />}
                group={group}
                props={rest}
            />
        )
    } else if (group.kind === 'counters') {
        return <PropertiesCounters group={group} options={group.config} />
    } else if (group.kind === 'object-list') {
        return <PropertiesObjectList options={group.config} />
    } else if (group.kind === 'alert-target-list') {
        return <PropertiesAlertList options={group.config} />
    } else {
        return <PropertyGroup group={group} props={rest} />
    }
}

export default PropertiesContents
