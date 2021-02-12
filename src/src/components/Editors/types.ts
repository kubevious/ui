import { SelectedData } from "../../types"

export type SelectedItemData = {
    status: Marker
    items: SelectedData[]
    item_count: number
}

export interface Marker {
    name?: string
    shape?: string
    color?: string
    item_count?: number
    error_count?: number
    is_current?: boolean
    enabled?: boolean
    propagate?: boolean
}

export enum EditorType {
    rule = "rule",
    marker = "marker",
}

export enum IndicatorType {
    disabled = "disabled",
    invalid = "invalid",
    enabled = "enabled"
}
