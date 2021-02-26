import _ from "the-lodash"
import moment from "moment"
import {
    prettyKind as helperPrettyKind,
    FLAG_TOOLTIPS,
} from "@kubevious/helpers/dist/docs"

export const prettyKind = (kind: string): string => {
    let value = helperPrettyKind(kind)
    if (!value) {
        value = _.upperFirst(kind)
    }
    return value
}

export const flagTooltip = (name: string): string => {
    let value: string = FLAG_TOOLTIPS[name]
    if (!value) {
        value = ""
    }
    return value
}

export function getNodeLogoUrl(kind: string): string {
    return `/img/entities/${kind}.svg`
}

const todayStr: string = moment(new Date()).format("YYYY-MM-DD")

export function formatDate(date: Date | d3.NumberValue): string {
    const validDate = Number(date)
    const dayStr: string = moment(validDate).format("YYYY-MM-DD")
    const timeStr: string = moment(validDate).format("hh:mm:ss A")
    if (todayStr === dayStr) {
        return timeStr
    } else {
        return dayStr + " " + timeStr
    }
}
