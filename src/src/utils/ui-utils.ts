import _ from 'the-lodash'
import moment from 'moment'
import { prettyKind as helperPrettyKind, FLAG_TOOLTIPS } from '@kubevious/helpers/dist/docs'

export const prettyKind = (kind: string): string => {
    var value = helperPrettyKind(kind);
    if (!value) {
        value = _.upperFirst(kind);
    }
    return value;
}

export const flagTooltip = (name: string): string | null => {
    var value: string | null = FLAG_TOOLTIPS[name];
    if (!value) {
        value = null;
    }
    return value;
}

export function getNodeLogoUrl(kind: string): string {
    return `/img/entities/${kind}.svg`
}

var todayStr: string = moment(new Date()).format('YYYY-MM-DD')

export function formatDate(date: Date): string {
    var dayStr: string = moment(date).format('YYYY-MM-DD')
    var timeStr: string = moment(date).format('hh:mm:ss A')
    if (todayStr === dayStr) {
        return timeStr
    } else {
        return dayStr + ' ' + timeStr
    }
}
