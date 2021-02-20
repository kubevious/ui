import { Config } from "../Properties/PropertiesAlertList/types"

export type SummaryState = {
    data: {
        [container: string]: {
            kind?: string
            id?: string
            title?: string
            order?: number
            config?: Config[]
        }
    }
}
