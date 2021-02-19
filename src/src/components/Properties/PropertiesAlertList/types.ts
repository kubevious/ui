import { Alert } from "../../../types";

export type Config = {
    targets: string[]
    alert: Alert
}

export type PropertiesAlertListProps = {
    config: Config[]
}
