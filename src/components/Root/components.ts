import { Alerts } from '@kubevious/ui-alerts';
import { Diagram } from '@kubevious/ui-diagram';
import { RuleEditor, MarkerEditor } from '@kubevious/ui-rule-engine'
import { Properties, Summary } from '@kubevious/ui-properties'
import { Timeline } from '@kubevious/ui-time-machine'

import { GoldenLayoutWindowInfo, GoldenLayoutLocation } from '@kubevious/ui-components';

export const components : GoldenLayoutWindowInfo[] = [
    {
        id: "summaryComponent",
        component: Summary,
        location: GoldenLayoutLocation.main,
        title: "Summary",
        skipClose: true,
        allowVerticalScroll: false,
    },
    // {
    //     id: "universeComponent",
    //     component: Diagram,
    //     location: GoldenLayoutLocation.main,
    //     title: "Universe",
    //     skipClose: true,
    // },
    // {
    //     id: "ruleEditorComponent",
    //     component: RuleEditor,
    //     location: GoldenLayoutLocation.main,
    //     title: "Rule Editor",
    // },
    // {
    //     id: "markerEditorComponent",
    //     component: MarkerEditor,
    //     location: GoldenLayoutLocation.main,
    //     title: "Marker Editor",
    // },
    // {
    //     id: "propertiesComponent",
    //     component: Properties,
    //     location: GoldenLayoutLocation.right,
    //     title: "Properties",
    //     width: 25,
    //     allowVerticalScroll: true,
    // },
    // {
    //     id: "alertsComponent",
    //     component: Alerts,
    //     location: GoldenLayoutLocation.bottom,
    //     title: "Alerts",
    //     height: 20,
    //     allowVerticalScroll: true,
    // },
    // {
    //     id: "timelineComponent",
    //     component: Timeline,
    //     location: GoldenLayoutLocation.bottom,
    //     title: "Timeline",
    //     height: 20,
    //     allowVerticalScroll: false,
    // }
]
