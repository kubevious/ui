import { Alerts } from '@kubevious/ui-alerts';
import { Diagram } from '@kubevious/ui-diagram';
import { RuleEditor, MarkerEditor } from '@kubevious/ui-rule-engine'
import { Properties, Summary } from '@kubevious/ui-properties'
import { Timeline } from '@kubevious/ui-time-machine'

import { GoldenLayoutWindowInfo, GoldenLayoutLocation } from '@kubevious/ui-components';
import { FilterSearchLabel } from '@kubevious/ui-search';
import { RestTool,SharedStateDebugger, WebsocketTool } from '@kubevious/ui-dev-tools/dist';

export const components : GoldenLayoutWindowInfo[] = [
    {
        id: "summaryComponent",
        component: Summary,
        location: GoldenLayoutLocation.main,
        title: "Summary",
        skipClose: true,
        allowVerticalScroll: false,
    },
    {
        id: "universeComponent",
        component: Diagram,
        location: GoldenLayoutLocation.main,
        title: "Universe",
        skipClose: true,
    },
    // {
    //     id: "testComponent",
    //     component: FilterSearchLabel,
    //     location: GoldenLayoutLocation.main,
    //     title: "TEST",
    //     skipClose: true,
    // },
    {
        id: "ruleEditorComponent",
        component: RuleEditor,
        location: GoldenLayoutLocation.main,
        title: "Rule Editor",
    },
    {
        id: "markerEditorComponent",
        component: MarkerEditor,
        location: GoldenLayoutLocation.main,
        title: "Marker Editor",
    },
    // {
    //     id: "restToolComponent",
    //     component: RestTool,
    //     location: GoldenLayoutLocation.main,
    //     title: "Rest Tool",
    // },
    // {
    //     id: "sharedStateDebuggerComponent",
    //     component: SharedStateDebugger,
    //     location: GoldenLayoutLocation.main,
    //     title: "Rest Tool",
    // },
    // {
    //     id: "websocketToolcomponent",
    //     component: WebsocketTool,
    //     location: GoldenLayoutLocation.main,
    //     title: "Rest Tool",
    // },
    {
        id: "propertiesComponent",
        component: Properties,
        location: GoldenLayoutLocation.right,
        title: "Properties",
        width: 25,
        allowVerticalScroll: true,
    },
    {
        id: "alertsComponent",
        component: Alerts,
        location: GoldenLayoutLocation.bottom,
        title: "Alerts",
        height: 20,
        allowVerticalScroll: true,
    },
    {
        id: "timelineComponent",
        component: Timeline,
        location: GoldenLayoutLocation.bottom,
        title: "Timeline",
        height: 20,
        allowVerticalScroll: false,
    }]
