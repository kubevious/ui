import React from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import _ from 'the-lodash'
import { generateDnPathHtml } from '../../utils/ui-utils'
import { parseDn } from '../../utils/naming-utils'
import PropertyGroup from './PropertyGroup'
import EnvironmentVariables from './EnvironmentVariables'
import DnList from './DnList'
import Config from './Config'
import PropertiesTable from './PropertiesTable'

import './styles.scss'
import './obsidian.css'

class Properties extends BaseComponent {
    constructor(props) {
        super(props)

        this.state = {
            selectedDn: null,
            selectedObjectProps: []
        }

        this._renderContent = this._renderContent.bind(this)
        this.onPropertyGroupPopup = this.onPropertyGroupPopup.bind(this)
    }

    propertyExpanderHandleClick(event) {
        var target = event.currentTarget
        target.classList.toggle('active')
        var contentsElem = target.parentElement.getElementsByClassName('expander-contents')[0]
        contentsElem.classList.toggle('expander-open')
    }

    onPropertyGroupPopup(event, group) {
        const contentHtml = this._detectGroupContent(group)
        this.props.handleShowPopup()
        this.props.handlePopupContent(contentHtml)
    }

    _detectGroupContent(group) {
        if (group.kind === 'key-value') {
            return <EnvironmentVariables group={group} dn={this.state.selectedDn}/>
        } else if (group.kind === 'dn-list') {
            return <DnList group={group} hidePopup={this.props.closePopup} dn={this.state.selectedDn}/>
        } else if (group.kind === 'yaml') {
            return <Config group={group} dn={this.state.selectedDn}/>
        } else if (group.kind === 'table') {
            return <PropertiesTable group={group} dn={this.state.selectedDn}/>
        }

        return ''
    }

    _renderPropertiesNodeDn() {
        const dnParts = parseDn(this.state.selectedDn)

        return (
            <div className="properties-owner" dangerouslySetInnerHTML={{ __html: generateDnPathHtml(dnParts) }}/>
        )
    }

    _renderContent() {
        const propertyGroups = _.orderBy(this.state.selectedObjectProps, x => {
            if (x.order) {
                return x.order
            }
            return 100
        })

        return (
            <>
                {propertyGroups.map((item, index) => {
                    const isExpanded = index === 0
                    return (
                        <PropertyGroup
                            key={index}
                            title={item.title}
                            extraClassTitle={(isExpanded ? 'active' : '')}
                            extraClassContents={(isExpanded ? 'expander-open' : '')}
                            tooltip={item.tooltip}
                            dn={item.dn}
                            groupName={item.id}
                            group={item}
                            propertyExpanderHandleClick={this.propertyExpanderHandleClick}
                            onPropertyGroupPopup={this.onPropertyGroupPopup}
                        />
                    )
                })}
            </>
        )
    }

    componentDidMount() {
        this.subscribeToSharedState(['selected_dn', 'selected_object_props'],
            ({ selected_dn, selected_object_props }) => {

                this.setState({ selectedDn: selected_dn, selectedObjectProps: selected_object_props })
            })
    }

    render() {
        const { selectedDn, selectedObjectProps } = this.state

        return (
            <div id="propertiesComponent" className="properties">
                {selectedDn && this._renderPropertiesNodeDn()}
                {selectedObjectProps && this._renderContent()}
            </div>
        )
    }
}

export default Properties
