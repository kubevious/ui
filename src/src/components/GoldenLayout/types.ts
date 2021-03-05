import { GoldenLayoutComponent } from "."
import { DiagramSource } from "../../state/diagram-source"
import { Alerts } from '@kubevious/ui-alerts';
import { Diagram } from '@kubevious/ui-diagram';
import { RuleEditor, MarkerEditor } from '@kubevious/ui-rule-engine'
import { Properties, Summary } from '@kubevious/ui-properties'
import { Timeline } from '@kubevious/ui-time-machine'

export type GoldenLayoutComponentProps = {
    diagramSource: DiagramSource
    handleLayout: (value: GoldenLayoutComponent) => void
}

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

export const components = [
    {
        name: "Summary",
        component: Summary,
        location: "main",
        title: "Summary",
        allowVerticalScroll: false,
    },
    {
        name: "Universe",
        component: Diagram,
        location: "main",
        title: "Universe",
        skipClose: true,
    },
    {
        name: "Rule Editor",
        component: RuleEditor,
        location: "main",
        title: "Rule Editor",
    },
    {
        name: "Marker Editor",
        component: MarkerEditor,
        location: "main",
        title: "Marker Editor",
    },
    {
        name: "Properties",
        component: Properties,
        location: "right",
        title: "Properties",
        width: 25,
        allowVerticalScroll: true,
    },
    {
        name: "Alerts",
        component: Alerts,
        location: "bottom",
        title: "Alerts",
        allowVerticalScroll: true,
    },
    {
        name: "Timeline",
        component: Timeline,
        location: "bottom",
        title: "Timeline",
        allowVerticalScroll: false,
    }]

export type Components =
    | typeof Diagram
    | typeof RuleEditor
    | typeof MarkerEditor
    | typeof Properties
    | typeof Alerts
    | typeof Timeline
    | typeof Summary

