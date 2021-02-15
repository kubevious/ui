import { Alerts } from "../Alerts"
import { Diagram } from "../Diagram"
import { MarkerEditor } from "../Editors/MarkerEditor"
import { RuleEditor } from "../Editors/RuleEditor"
import { Properties } from "../Properties"
import { Summary } from "../Summary"
import { Timeline } from "../Timeline"

export type Component = {
    id?: string
    name: string
    component: Components
    location: string
    title: string
    allowVerticalScroll?: boolean
    skipClose?: boolean
    height?: number
    width?: number
    goldenComponent?: any
    goldenTab?: any
    goldenContainer?: any
}

export type Components =
        | typeof Diagram
        | typeof RuleEditor
        | typeof MarkerEditor
        | typeof Properties
        | typeof Alerts
        | typeof Timeline
        | typeof Summary

