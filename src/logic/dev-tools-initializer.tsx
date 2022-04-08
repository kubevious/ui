import React from 'react';
import { FABrandsIcons, FASolidIcons, SideMenuSection } from "@kubevious/ui-components";
import { app, SharedState } from "@kubevious/ui-framework"
import { ENDPOINTS } from "../metadata/endpoints";
import { SideMenuItemKey } from "../metadata/side-menu-keys";
import { RestTool, WebsocketTool, SharedStateDebugger } from '@kubevious/ui-dev-tools';

export function setupDevTools(sharedState: SharedState)
{
    if (process.env.REACT_APP_ENABLE_DEV_TOOLS) {
        sharedState.set('endpoints', ENDPOINTS);
        sharedState.set('dev_tools_enabled', true);
    }
    
    (window as any).openDevTools = () => {
        sharedState.set('endpoints', ENDPOINTS);
        sharedState.set('dev_tools_enabled', true);
    }

    (window as any).closeDevTools = () => {
        sharedState.set('dev_tools_enabled', false);
    }

}

export function devToolsSideMenu() : SideMenuSection
{
    const sharedState = app.sharedState;

    return {
        name: 'Dev Tools',
        condition: () => sharedState.get("dev_tools_enabled", false),
        items: [
            {
                key: SideMenuItemKey.sharedStateDebugger,
                label: 'Shared State Debugger',
                faIcon: FASolidIcons.faBug,
                onClick: () => {
                    sharedState.set('popup_window', {
                        content: <SharedStateDebugger />
                    });
                },
            },
            {
                key: SideMenuItemKey.restTool,
                label: 'REST Tool',
                faIcon: FASolidIcons.faVials,
                onClick: () => {
                    sharedState.set('popup_window', {
                        content: <RestTool />
                    });
                },
            },
            {
                key: SideMenuItemKey.websocketTool,
                label: 'Websocket Tool',
                faIcon: FABrandsIcons.faRocketchat,
                onClick: () => {
                    sharedState.set('popup_window', {
                        content: <WebsocketTool />
                    });
                },
            },
        ],
    };
}