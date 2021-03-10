import { GoldenLayout, GoldenLayoutWindowInfo } from '@kubevious/ui-components';

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
    layout: GoldenLayout | null
    windows: GoldenLayoutWindowInfo[]
    isError: boolean
    error: Error | null
}
