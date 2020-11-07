import _ from 'the-lodash'
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

export function getNodeLogoUrl(kind) {
    return `/img/entities/${kind}.svg`
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
