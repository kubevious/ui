import { SelectedData, EditorItem } from "../../types"

export type List = {
    payload: string
    shownValue: string
}

export type KindListValue = {
    title: string
    payload:
        | {
              kind: string
              count: number
          }
        | string
}

export interface KindList extends List {
    values: KindListValue[]
}

export interface MarkersList extends List {
    values: EditorItem[]
}

export type FilterObjectType = {
    key?: string
    value?: string
    kind?: string
    count?: number
}

export type FilterType = FilterObjectType | string

export type SearchValue = {
    criteria?: string
    kind?: string
    markers?: string[]
    labels?: {
        key: string
        value: string
    }
    annotations?: {
        key: string
        value: string
    }
    error?: {
        kind: string
        count?: number
    }
}

export type SearchState = {
    result: SelectedData[]
    totalCount: number
    value: SearchValue
    savedFilters: SearchValue
    currentInput: {
        labels: {
            key: string
            value: string
        }
        annotations: {
            key: string
            value: string
        }
    }
    autocomplete: {
        labels: {
            keys: string[]
            values: string[]
        }
        annotations: {
            keys: string[]
            values: string[]
        }
    }
    wasFiltered?: boolean
}
