import _ from 'lodash'
import $ from 'jquery'
import DocUtils from 'kubevious-helpers/lib/docs'
import moment from 'moment'

export const prettyKind = (kind) => {
    var value = DocUtils.prettyKind(kind);
    if (!value) {
        value = _.upperFirst(kind);
    }
    return value;
}

export const flagTooltip = (name) => {
    var value = DocUtils.FLAG_TOOLTIPS[name];
    if (!value) {
        value = null;
    }
    return value;
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
