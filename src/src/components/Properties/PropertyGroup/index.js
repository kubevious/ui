import React from 'react'

const PropertyGroup = ({ group, Component, props }) => {
    const {
        extraClassTitle,
        extraClassContents,
        tooltip,
        groupName,
        propertyExpanderHandleClick,
        onPropertyGroupPopup,
    } = props
    const title = props.title ? props.title : group.title

    const renderGroup = () => {
        return Component
    }
    return (
        <div className="property-group">
            <button
                id="expander"
                className={`expander ${extraClassTitle}`}
                tag={`${groupName}`}
                onClick={propertyExpanderHandleClick}
            >
                {title}
                <span className="property-group-openclose" />
                <span
                    className="property-group-popup"
                    tag={`${groupName}`}
                    onClick={(e) => onPropertyGroupPopup(e, group, Component)}
                />

                {tooltip && (
                    <>
                        <span
                            className="property-group-info"
                            data-toggle="property-tooltiptext"
                            data-placement="top"
                        />
                        <span className="property-tooltiptext">{tooltip}</span>
                    </>
                )}
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
