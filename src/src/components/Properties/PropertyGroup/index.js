import React from 'react'
import { propertyGroupTooltip } from '@kubevious/helpers/dist/docs'
import _ from 'the-lodash'
import PropertiesContents from '../PropertiesContents'

const PropertyGroup = ({
    title,
    extraClassTitle,
    extraClassContents,
    dn,
    dnKind,
    groupName,
    group,
    propertyExpanderHandleClick,
    onPropertyGroupPopup,
}) => {
    let tooltip = null;
    const tooltipInfo = propertyGroupTooltip(group.id);
    if (tooltipInfo && _.isObject(tooltipInfo)) {
        const str = _.get(tooltipInfo, 'owner.' + dnKind);
        tooltip = str ? str : _.get(tooltipInfo, 'default')
    } else if (tooltipInfo && _.isString(tooltipInfo))  {
        tooltip = tooltipInfo;
    }

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

    return <PropertiesContents renderGroup={renderPropertyGroup} group={group} />
}

export default PropertyGroup
