import { SelectedData } from "../../types"

export type SelectedItemData = {
    status: MarkerStatus
    items: SelectedData[]
    item_count: number
}

export interface MarkerStatus {
    name?: string
    shape?: string
    color?: string
    item_count?: number
    is_current?: boolean
}

export type SelectedItem = {
    name: string
    color: string
    shape: string
    propagate: boolean
}
