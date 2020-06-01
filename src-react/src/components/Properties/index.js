import React, { PureComponent } from 'react'
import $ from 'jquery'
import _ from 'lodash'
import {
    generateDnPathHtml,
    popupClose, popupOpen
} from '../../utils/ui-utils'
import { parseDn } from '../../utils/naming-utils'
import PropertyGroup from './PropertyGroup'
import EnvironmentVariables from './EnvironmentVariables'
import DnList from './DnList'
import Config from './Config'
import PropertiesTable from './PropertiesTable'

import './styles.css'
import './obsidian.css'

class Properties extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            selectedDn: null,
            selectedObjectProps: null
        }

        this._renderContent = this._renderContent.bind(this)
        this.onPropertyGroupPopup = this.onPropertyGroupPopup.bind(this)
    }

    get service() {
        return this.props.service
    }

    propertyExpanderHandleClick(event) {
        var target = event.currentTarget
        target.classList.toggle('active')
        var contentsElem = target.parentElement.getElementsByClassName('expander-contents')[0]
        contentsElem.classList.toggle('expander-open')
    }

    onPropertyGroupPopup(event, group) {
        var contentHtml = this._detectGroupContent(group)

        popupOpen(contentHtml, {
            focus: '#searchInput',
            header: {
                dn: this.state.selectedDn,
                title: group.title
            }
        })

        $('.popup button.close').on('click', (e) => popupClose(e))
    }

    _detectGroupContent(group) {
        if (group.kind === 'key-value') {
            return <EnvironmentVariables group={group}/>
        } else if (group.kind === 'dn-list') {
            return <DnList group={group} sharedState={this.props.sharedState}/>
        } else if (group.kind === 'yaml') {
            return <Config group={group}/>
        } else if (group.kind === 'table') {
            return <PropertiesTable group={group}/>
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
                            sharedState={this.props.sharedState}
                            propertyExpanderHandleClick={this.propertyExpanderHandleClick}
                            onPropertyGroupPopup={this.onPropertyGroupPopup}
                        />
                    )
                })}
            </>
        )
    }

    componentDidMount() {
        this.props.sharedState.subscribe(['selected_dn', 'selected_object_props'],
            ({ selected_dn, selected_object_props }) => {

                this.setState({ selectedDn: selected_dn, selectedObjectProps: selected_object_props })
            })
    }

    render() {
        const { selectedDn, selectedObjectProps } = this.state

        return (
            <div id="properties" className="properties">
                {selectedDn && this._renderPropertiesNodeDn()}
                {selectedObjectProps && this._renderContent()}
            </div>
        )
    }
}

export default Properties
