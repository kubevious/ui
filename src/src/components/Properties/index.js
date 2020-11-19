import React from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import _ from 'the-lodash'
import { parseDn } from '../../utils/naming-utils'
import PropertyGroup from './PropertyGroup'
import EnvironmentVariables from './EnvironmentVariables'
import DnList from './DnList'
import Config from './Config'
import PropertiesTable from './PropertiesTable'
import DnPath from '../GenerateDnPath'
import cx from 'classnames'

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

        this.sharedState.set('popup_window', {
            title: 'Properties: ' + group,
            content: contentHtml
        });
    }

    _detectGroupContent(group) {
        if (group.kind === 'key-value') {
            return <EnvironmentVariables group={group} dn={this.state.selectedDn}/>
        } else if (group.kind === 'dn-list') {
            return <DnList group={group} dn={this.state.selectedDn}/>
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
            <div className="properties-owner">
                <DnPath dnParts={dnParts} includeLogo bigLogo />
            </div>
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

    renderUserView() {
        const { selectedDn, selectedObjectProps } = this.state

        if (!selectedDn && !selectedObjectProps) {
            return <div className="message-empty">No object selected.</div>
        }

        return <>
            {selectedDn && this._renderPropertiesNodeDn()}
            {selectedObjectProps && this._renderContent()}
        </>
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
            <div
                id="propertiesComponent"
                className={cx('properties', {
                'empty': !selectedDn && !selectedObjectProps,
                })}
            >
                {this.renderUserView()}
            </div>
        )
    }
}

export default Properties
