import { FASolidIcons, FABrandsIcons } from '@kubevious/ui-components';
import { SideMenuSection } from '@kubevious/ui-components';

import { sharedState } from '../configureService';

export enum SideMenuItemKey {
    // Operational
    browser = 'browser',
    search = 'search',

    // Rules Engine
    validators = 'validators',
    rules = 'rules',
    markers = 'markers',

    // Help
    support = 'support',

    // DevTools
    restTool = 'restTool',
    sharedStateDebugger = 'sharedStateDebugger',
    websocketTool = 'websocketTool',
}

export const SIDE_MENU_DATA : SideMenuSection[] = [

    {
        name: 'Operational',
        items: [
            {
                key: 'browser',
                label: 'Browser',
                icon: 'browser.svg',
                url: '/browser',
            },
            {
                key: 'search',
                label: 'Search',
                icon: 'search.svg',
                url: '/search',
            },
        ],
    },
    {
        name: 'Rules Engine',
        items: [
            {
                key: 'validators',
                label: 'Validators',
                icon: 'validators.svg',
                url: '/validators',
            },
            {
                key: 'rules',
                label: 'Rules',
                icon: 'rules.svg',
                url: '/rules',
            },
            {
                key: 'markers',
                label: 'Markers',
                icon: 'markers.svg',
                url: '/markers',
            },
        ],
    },
   
    {
        name: 'Help',
        items: [
            {
                key: 'support',
                label: 'Support',
                icon: 'support.svg',
                url: '/support',
            },
        ],
    },
    {
        name: 'Dev Tools',
        condition: () => sharedState.get("dev_tools_enabled", false),
        items: [
            {
                key: SideMenuItemKey.sharedStateDebugger,
                label: 'Shared State Debugger',
                faIcon: FASolidIcons.faBug,
                onClick: () => {
                    const key = 'dev_tools_popup_content';
                    if (sharedState.tryGet(key)) {
                        sharedState.set(key, null);
                    } else {
                        sharedState.set(key, SideMenuItemKey.sharedStateDebugger);
                    }
                },
            },
            {
                key: SideMenuItemKey.restTool,
                label: 'REST Tool',
                faIcon: FASolidIcons.faVials,
                onClick: () => {
                    const key = 'dev_tools_popup_content';
                    if (sharedState.tryGet(key)) {
                        sharedState.set(key, null);
                    } else {
                        sharedState.set(key, SideMenuItemKey.restTool);
                    }
                },
            },
            {
                key: SideMenuItemKey.websocketTool,
                label: 'Websocket Tool',
                faIcon: FABrandsIcons.faRocketchat,
                onClick: () => {
                    const key = 'dev_tools_popup_content';
                    if (sharedState.tryGet(key)) {
                        sharedState.set(key, null);
                    } else {
                        sharedState.set(key, SideMenuItemKey.websocketTool);
                    }
                },
            },
        ],
    },
];

