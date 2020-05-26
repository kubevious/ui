import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import $ from 'jquery'
import _ from 'lodash'
import {
    activateTooltips,
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
var propertiesScope = {
    dn: null,
    expandedMap: {}
}

class Properties extends Component {
    constructor(props) {
        super(props)

        props.state.subscribe(["selected_dn", "selected_object_props"], 
            ({selected_dn, selected_object_props}) => {

            if (selected_dn) {
                this._showObjectProperties(selected_dn, selected_object_props)
            } else {
                this._clearObjectProperties();
            }
        })
        
    }

    propertyExpanderHandleClick(event) {
        var target = event.currentTarget
        target.classList.toggle('active')
        var contentsElem = target.parentElement.getElementsByClassName('expander-contents')[0]
        contentsElem.classList.toggle('expander-open')

        var groupId = target.getAttribute('tag')
        propertiesScope.expandedMap[groupId] =
            target.classList.contains('active')
    }

    onPropertyGroupPopup(event) {
        var groupName = event.target.getAttribute('tag')
        var group = propertiesScope.propertyGroups[groupName]
        var contentHtml = this._detectGroupContent(group)

        popupOpen(contentHtml, {
            focus: '#searchInput',
            header: {
                dn: propertiesScope.dn,
                title: group.title
            }
        })

        $('.popup button.close').on('click', (e) => popupClose(e))
    }

    _clearProperties() {
        $('#properties').empty()
    }

    _detectGroupContent(group) {
        if (group.kind === 'key-value') {
            return <EnvironmentVariables group={group}/>
        } else if (group.kind === 'dn-list') {
            return <DnList group={group} state={this.props.state}/>
        } else if (group.kind === 'yaml') {
            return <Config group={group}/>
        } else if (group.kind === 'table') {
            return <PropertiesTable group={group}/>
        }

        return ''
    }

    _showObjectProperties(dn, propertyGroups) {
        var tryRecoverExpansion = false
        if (propertiesScope.dn === dn) {
            tryRecoverExpansion = true
        } else {
            propertiesScope.dn = dn
        }
        this._clearProperties()
        this._renderPropertiesNodeDn(dn);
        propertyGroups = _.orderBy(propertyGroups, x => {
            if (x.order) {
                return x.order
            }
            return 100
        })
        var isFirst = true
        propertiesScope.propertyGroups = {}
        for (var group of propertyGroups) {
            var isExpanded = false
            if (tryRecoverExpansion) {
                if (propertiesScope.expandedMap[group.id]) {
                    isExpanded = true
                }
            } else {
                isExpanded = isFirst
            }
            propertiesScope.propertyGroups[group.id] = group
            group.dn = dn
            this._renderPropertyGroup(group, isExpanded)
            propertiesScope.expandedMap[group.id] = isExpanded
            isFirst = false
        }

        $('button.expander').on('click', (e) => {
            this.propertyExpanderHandleClick(e)
        })
        $('.property-group-popup').on('click', (e) => {
            this.onPropertyGroupPopup(e);
        })
    }

    _renderPropertyGroup(group, isExpanded) {

        var groupHtml = renderToString(<PropertyGroup
            title={group.title}
            extraClassTitle={(isExpanded ? 'active' : '')}
            extraClassContents={(isExpanded ? 'expander-open' : '')}
            tooltip={group.tooltip}
            dn={group.dn}
            groupName={group.id}
            group={group}
            state={this.props.state}

        />)

        $('#properties').append(groupHtml)

        activateTooltips();

    }

    _renderPropertiesNodeDn(dn) {
        var dnParts = parseDn(dn)
        var html = '<div class="properties-owner">'
        html += generateDnPathHtml(dnParts)
        html += '</div>'

        $('#properties').append(html)
    }

    _clearObjectProperties() {
        propertiesScope.dn = null
        propertiesScope.expandedMap = {}

        this._clearProperties()
    }

    render() {
        return (
            <div id="properties" className="properties"/>
        )
    }
}

export default Properties
