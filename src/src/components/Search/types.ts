import { MarkerItem } from "../Editors/types"

export type List = {
    payload: string
    shownValue: string
}

export interface KindList extends List {
    values: {
        title: string
        payload:
            | {
                  kind: string
                  count: number
              }
            | string
    }[]
}

export interface MarkersList extends List {
    values: MarkerItem[]
}
