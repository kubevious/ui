import React from 'react'
import EnvironmentVariables from '../EnvironmentVariables'
import DnList from '../DnList'
import Config from '../Config'
import PropertiesTable from '../PropertiesTable'

const PropertyGroup = ({ title, extraClassTitle, extraClassContents, tooltip, dn, groupName, group,
                           propertyExpanderHandleClick, onPropertyGroupPopup }) => {
    const renderGroup = (options = {}) => {
        options.relativeTo = dn;

        if (group.kind === 'key-value') {
            if (group.id === 'env') {
                options.keyLabel = 'Variable'
            }

            return <EnvironmentVariables group={group} options={options}/>
        } else if (group.kind === 'dn-list') {
            return <DnList group={group} options={options} />
        } else if (group.kind === 'yaml') {
            return <Config group={group}/>
        } else if (group.kind === 'table') {
            return <PropertiesTable group={group} options={options}/>
        }
    }

    return (
        <div className="property-group">
            <button id="expander" className={`expander ${extraClassTitle}`} tag={`${groupName}`}
                    onClick={propertyExpanderHandleClick}>
                {title}
                <span className="property-group-openclose"/>
                <span className="property-group-popup" tag={`${groupName}`}
                      onClick={(e) => onPropertyGroupPopup(e, group)}/>

                {tooltip &&
                <span className="property-group-info" data-toggle="tooltip" data-placement="top" title={`${tooltip}`}/>}
            </button>
            <div className="scrollbar dark">
                <div className="force-overflow">
                    <div className={`expander-contents ${extraClassContents}`}>
                        {renderGroup()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PropertyGroup
