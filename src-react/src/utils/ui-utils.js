import React from 'react'
import _ from 'lodash'
import $ from 'jquery'
import { KIND_TO_USER_MAPPING } from './constants'
import hljs from 'highlight.js'
import moment from 'moment'
import Popup from '../components/Popup'
import { renderToString } from 'react-dom/server'

export const prettyKind = (kind) => {
    var prettyKind = KIND_TO_USER_MAPPING[kind]
    if (!prettyKind) {
        prettyKind = _.upperFirst(kind)
    }
    return prettyKind
}

export function generateDnPathHtml(dnParts, includeLogo) {
    var html = '<div class="dn-path">'
    var parts = []
    if (dnParts.length > 0) {
        if (dnParts[0].kind === 'root') {
            dnParts = dnParts.splice(1)
        }
    }
    var lastPart = _.last(dnParts)
    if (includeLogo && lastPart) {
        html += '<img class="dn-logo" src="'
        html += getNodeLogoUrl(lastPart.kind)
        html += '" />'
    }
    for (var dnPart of dnParts) {
        var kind = prettyKind(dnPart.kind)
        var partHtml =
            '<span class="kind">' + kind + '</span>' +
            '<span> </span>' +
            '<span class="name">' + dnPart.name + '</span>'
        parts.push(partHtml)
    }
    html += parts.join(' <span class="separator">&gt;</span> ')
    html += '<div class="clearfix"></div>'
    html += '</div>'
    return html
}

export function getNodeLogoUrl(kind) {
    return '/img/entities/' + kind + '.svg'
}

export function popupClose(event) {
    if (event) {
        if (event.target !== event.currentTarget) {
            return;
        }
    }
    $('#popup').remove()
}

var todayStr = moment(new Date()).format('YYYY-MM-DD')

export function formatDate(date) {
    var dayStr = moment(date).format('YYYY-MM-DD')
    var timeStr = moment(date).format('hh:mm:ss A')
    if (todayStr === dayStr) {
        return timeStr
    } else {
        return dayStr + ' ' + timeStr
    }
}

export function popupOpen(contents, params) {
    params = params || {}
    var header = null
    if (params.header) {
        header = params.header
    }

    var html = renderToString(<Popup header={header} contents={contents} />)

    $('body').append(html)

    $('#popup').on('click', (event) => popupClose(event))
    $('button.close').on('click', (event) => popupClose(event))

    if (params.focus) {
        $(params.focus).focus()
    }
}

export function activateTooltips() {
    $('.property-group-info').tooltip()
}