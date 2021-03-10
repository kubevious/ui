import { GoldenLayoutWindowInfo } from "../../types"

export type HeaderState = {
    showSettings: boolean
    isLoading: boolean
    hasNotifications: boolean
    time_machine_enabled: boolean
    time_machine_target_date: Date | null
}

export type HeaderProps = {
    handleChangeWindow: (e: React.ChangeEvent<HTMLInputElement>) => void
    windows:  GoldenLayoutWindowInfo[]
}
