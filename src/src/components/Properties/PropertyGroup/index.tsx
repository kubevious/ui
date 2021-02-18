import React from 'react'
import PropTypes from 'prop-types'
import { propertyGroupTooltip } from '@kubevious/helpers/dist/docs'
import _ from 'the-lodash'
import { ClassComponent } from '@kubevious/ui-framework'
import { DnComponent } from '../../DnComponent'
import { PropertiesContents } from '../PropertiesContents'
import { Group } from '../../../types'

type PropertyGroupProps = {
    title: string,
    extraClassTitle: string,
    extraClassContents: string,
    dn: string,
    dnKind: string,
    groupName: string,
    group: Group,
    propertyExpanderHandleClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}

export class PropertyGroup extends ClassComponent<PropertyGroupProps> {
    tooltip: string
    constructor(props) {
        super(props)

        this.tooltip = ''
        this.renderTooltip()
    }

    renderTooltip(): void {
        const { group, dnKind } = this.props
        const tooltipInfo = propertyGroupTooltip(group.id)
        if (tooltipInfo && _.isObject(tooltipInfo)) {
            const str: string = _.get(tooltipInfo, 'owner.' + dnKind)
            this.tooltip = str ? str : _.get(tooltipInfo, 'default')
        } else if (tooltipInfo && _.isString(tooltipInfo)) {
            this.tooltip = tooltipInfo
        }
    }

    openMaximized(): void
    {
        const {
            dn,
            group,
        } = this.props

        this.sharedState.set('popup_window', {
            title: 'Properties: ' + group,
            content:
                group.kind !== 'yaml' ? (
                    <div
                        className={`Property-wrapper p-40 overflow-hide`}
                    >
                        {dn && (
                            <div className="container-header">
                                <DnComponent dn={dn} />
                                <h3>{group.title}</h3>
                            </div>
                        )}
                        <PropertiesContents group={group} />
                    </div>
                ) : (
                    <PropertiesContents
                        group={group}
                        dn={dn}
                    />
                ),
        })
    }

    render() {
        const {
            title,
            extraClassTitle,
            extraClassContents,
            group,
            propertyExpanderHandleClick,
        } = this.props

        return (
            <div className="property-group">
                <button
                    id="expander"
                    className={`expander ${extraClassTitle}`}
                    onClick={propertyExpanderHandleClick}
                >
                    {title}
                    <span className="property-group-openclose" />
                    <span
                        className="property-group-popup"
                        onClick={(e) => {
                            this.openMaximized();
                        }}
                    />
                    {this.tooltip && (
                        <>
                            <span
                                className="property-group-info"
                                data-toggle="property-tooltiptext"
                                data-placement="top"
                            />
                            <span className="property-tooltiptext">
                                {this.tooltip}
                            </span>
                        </>
                    )}
                </button>
                <div className="scrollbar dark">
                    <div className="force-overflow">
                        <div
                            className={`expander-contents ${extraClassContents}`}
                        >
                            <PropertiesContents group={group} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
