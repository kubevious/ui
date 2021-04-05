import { List } from "../../Header/types"

export type KindListValue = {
    title: string
    payload: string
}

export interface KindList extends List {
    values: KindListValue[]
}
