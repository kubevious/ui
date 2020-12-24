import React from 'react'
import PropertiesContents from '../PropertiesContents'
import EnvironmentVariables from '../EnvironmentVariables'
import DnList from '../DnList'
import Config from '../Config'
import PropertiesTable from '../PropertiesTable'

const PropertyGroup = ({
    title,
    extraClassTitle,
    extraClassContents,
    tooltip,
    dn,
    groupName,
    group,
    propertyExpanderHandleClick,
    onPropertyGroupPopup,
}) => {
    const renderPropertyGroup = (Component) => {
        return (
            <div className="property-group">
                <button
                    id="expander"
                    className={`expander ${extraClassTitle}`}
                    tag={groupName}
                    onClick={propertyExpanderHandleClick}
                >
                    {title}
                    <span className="property-group-openclose" />
                    <span
                        className="property-group-popup"
                        tag={groupName}
                        onClick={(e) =>
                            onPropertyGroupPopup(e, group, Component)
                        }
                    />
                    {tooltip && (
                        <>
                            <span
                                className="property-group-info"
                                data-toggle="property-tooltiptext"
                                data-placement="top"
                            />
                            <span className="property-tooltiptext">
                                {tooltip}
                            </span>
                        </>
                    )}
                </button>
                <div className="scrollbar dark">
                    <div className="force-overflow">
                        <div
                            className={`expander-contents ${extraClassContents}`}
                        >
                            {Component}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    switch (group.kind) {
        case 'key-value':
            return renderPropertyGroup(<EnvironmentVariables group={group} />)
        case 'dn-list':
            return renderPropertyGroup(<DnList group={group} />)
        case 'yaml':
            return renderPropertyGroup(<Config group={group} />)
        case 'table':
            return renderPropertyGroup(<PropertiesTable group={group} />)
        default:
            return <PropertiesContents group={group} />
    }
}

export default PropertyGroup
