import React from 'react'
import { RouteComponentProps } from 'react-router'

export interface PageData<SideMenuItemId> {
    url: string,
    sideMenu: SideMenuItemId,
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>,
    isDefaultMenuPage?: boolean
}

export interface PagesData<SideMenuItemId> {
    pages: PageData<SideMenuItemId>[]
}
