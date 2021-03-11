import { Alerts } from '@kubevious/ui-alerts';
import { Diagram } from '@kubevious/ui-diagram';
import { RuleEditor, MarkerEditor } from '@kubevious/ui-rule-engine'
import { Properties, Summary } from '@kubevious/ui-properties'
import { Timeline } from '@kubevious/ui-time-machine'

import { GoldenLayoutWindowInfo, GoldenLayoutLocation } from '@kubevious/ui-components';

export const components : GoldenLayoutWindowInfo[] = [
    {
        id: "SummaryComponent",
        component: Summary,
        location: GoldenLayoutLocation.main,
        title: "Summary",
        skipClose: true,
        allowVerticalScroll: false,
    },
    {
        id: "UniverseComponent",
        component: Diagram,
        location: GoldenLayoutLocation.main,
        title: "Universe",
        skipClose: true,
    },
    {
        id: "RuleEditorComponent",
        component: RuleEditor,
        location: GoldenLayoutLocation.main,
        title: "Rule Editor",
    },
    {
        id: "MarkerEditorComponent",
        component: MarkerEditor,
        location: GoldenLayoutLocation.main,
        title: "Marker Editor",
    },
    {
        id: "PropertiesComponent",
        component: Properties,
        location: GoldenLayoutLocation.right,
        title: "Properties",
        width: 25,
        allowVerticalScroll: true,
    },
    {
        id: "AlertsComponent",
        component: Alerts,
        location: GoldenLayoutLocation.bottom,
        title: "Alerts",
        allowVerticalScroll: true,
    },
    {
        id: "TimelineComponent",
        component: Timeline,
        location: GoldenLayoutLocation.bottom,
        title: "Timeline",
        allowVerticalScroll: false,
    }]
