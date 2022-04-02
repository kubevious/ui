import { Alerts } from '@kubevious/ui-alerts';
import { Diagram } from '../Diagram';
import { Properties } from '@kubevious/ui-properties';
import { Timeline } from '@kubevious/ui-time-machine';
import { NodeHistory } from '@kubevious/ui-time-machine';
import { Summary } from '../Summary';

import { TOP_ROOTS, DiagramRoot } from '@kubevious/entity-meta';
import { GoldenLayoutWindowInfo, GoldenLayoutLocation } from '@kubevious/ui-components';

export const layoutComponents: GoldenLayoutWindowInfo[] = [];

layoutComponents.push({
    id: 'summaryComponent',
    component: Summary,
    location: GoldenLayoutLocation.main,
    title: 'Summary',
    skipClose: true,
    allowVerticalScroll: false,
});

export interface DiagramBrowserViewInfo {
    root: DiagramRoot,
    componentId?: string
}

export const browserViewInfos : DiagramBrowserViewInfo[] =
    TOP_ROOTS.map(x => ({
        root: x
    }))


for(let viewInfo of browserViewInfos) {
    viewInfo.componentId = `diagram${viewInfo.root.title}Component`;
    layoutComponents.push(    {
        id: viewInfo.componentId,
        component: Diagram,
        location: GoldenLayoutLocation.main,
        title: viewInfo.root.title,
        skipClose: true,
        props: {
            rootDn: viewInfo.root.dn
        }
    });
}

layoutComponents.push({
    id: 'propertiesComponent',
    component: Properties,
    location: GoldenLayoutLocation.right,
    title: 'Properties',
    width: 25,
    allowVerticalScroll: true,
});

layoutComponents.push({
    id: 'alertsComponent',
    component: Alerts,
    location: GoldenLayoutLocation.bottom,
    title: 'Alerts',
    height: 20,
    allowVerticalScroll: true,
});

layoutComponents.push({
    id: "timelineComponent",
    component: Timeline,
    location: GoldenLayoutLocation.bottom,
    title: "Timeline",
    height: 20,
    allowVerticalScroll: false,
});

layoutComponents.push({
    id: "nodeHistoryComponent",
    component: NodeHistory,
    location: GoldenLayoutLocation.bottom,
    title: "Change History",
    height: 20,
    allowVerticalScroll: false,
});