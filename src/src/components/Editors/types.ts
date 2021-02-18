import { SelectedData } from "../../types"

export type Log = {
    kind: string
    msg: {
        source: string[]
        msg: string
    }
}

export type SelectedItemData = {
    items: SelectedData[]
    item_count: number
    is_current?: boolean
    logs: Log[]
}

export interface EditorItem {
    script?: string
    target?: string
    name?: string
    propagate?: boolean
    shape?: string
    color?: string
    item_count?: number
    error_count?: number
    enabled?: boolean
    is_current?: boolean
}

export enum EditorType {
    rule = "rule",
    marker = "marker",
}

export enum IndicatorType {
    disabled = "disabled",
    invalid = "invalid",
    enabled = "enabled",
}