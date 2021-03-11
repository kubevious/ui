import { GoldenLayoutWindowInfo } from "@kubevious/ui-components"

export type HeaderState = {
    showSettings: boolean
    isLoading: boolean
    hasNotifications: boolean
    time_machine_enabled: boolean
    time_machine_target_date: Date | null
    visible_windows: Record<string, boolean>
}

export type HeaderProps = {
    windows:  GoldenLayoutWindowInfo[]
}
