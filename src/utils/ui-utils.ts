import _ from "the-lodash"
import {
    prettyKind as helperPrettyKind,
} from "@kubevious/helpers/dist/docs"

export const prettyKind = (kind: string): string => {
    let value = helperPrettyKind(kind)
    if (!value) {
        value = _.upperFirst(kind)
    }
    return value
}
