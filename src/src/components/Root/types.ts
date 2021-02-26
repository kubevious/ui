import { GoldenLayoutComponent } from "../GoldenLayout";
import { Component } from "../GoldenLayout/types";

export type Error = {
    data: {
        message: string
        stack: string
        reason?: string
        name?: string
        mark?: {
            name?: string | null
            buffer?: string
            position?: number
            line?: number
            column?: number
        }
    }
    status?: number
}

export type RootState = {
    showPopup: boolean
    popupContent: any
    layout: GoldenLayoutComponent | null
    windows: Component[]
    isError: boolean
    error: Error | null
}
