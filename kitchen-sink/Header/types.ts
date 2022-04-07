import { GoldenLayoutWindowInfo } from "@kubevious/ui-components"

export type HeaderState = {
    showSettings: boolean
    isLoading: boolean
    hasNotifications: boolean
    visible_windows: Record<string, boolean>
}

export type HeaderProps = {
    windows:  GoldenLayoutWindowInfo[]
}
