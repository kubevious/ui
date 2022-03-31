import { PagesData } from '../types/page';
import { SideMenuItemKey } from './side-menu';

// import { DashboardPage } from '../pages/dashboard/DashboardPage';
// import { RestToolPage } from '../components/DevTools/RestTool';

// import { ClustersEditorListPage } from '../pages/setup/ClustersEditorListPage';
// import { ClusterCreator } from '../pages/setup/ClusterCreator';
// import { ClusterEditor } from '../pages/setup/ClusterEditor';
// import { ClusterTokenPage } from '../pages/setup/ClusterTokenPage';
import { RulesPage } from '../pages/rules/RulesPage';
import { MarkersPage } from '../pages/rules/MarkersPage';
// import { ValidatorsPage } from '../pages/setup/ValidatorsPage';
// import { ValidatorDetailsPage } from  '../pages/setup/ValidatorDetailsPage';

// import { ClustersBrowserPage } from '../pages/operational/ClustersBrowserPage';
import { ClusterBrowserPage } from '../pages/operational/ClusterBrowserPage';
import { SearchPage } from '../pages/operational/SearchPage';
// import { Universe } from '../pages/operational/Universe';
// import { WebsocketTool } from '@kubevious/ui-dev-tools';
// import { SupportPage } from '../pages/help/Support';


import { AboutPage } from '../pages/project/About';


export const CLUSTER_BROWSER_PAGE = "/browser";
export const RULE_PAGE = "/rules";
// export const DASHBOARD_PAGE = '/dashboard';

// export const ACCOUNT_READY_PAGE = DASHBOARD_PAGE;

// export const VALIDATORS_PAGE = '/validators';
// export const VALIDATOR_DETAILS_PAGE = '/validators/details';

export const pagesData: PagesData<SideMenuItemKey> = {
    pages: [

        // Project
        {
            url: '/project/about',
            sideMenu: SideMenuItemKey.browser,
            component: AboutPage,
            isDefaultMenuPage: true,
        },



        // // Dashboard
        // {
        //     url: DASHBOARD_PAGE,
        //     sideMenu: SideMenuItemKey.dashboard,
        //     component: DashboardPage,
        //     isDefaultMenuPage: true,
        // },

        // // Setup
        // {
        //     url: '/clusters',
        //     sideMenu: SideMenuItemKey.clusters,
        //     component: ClustersEditorListPage,
        //     isDefaultMenuPage: true,
        // },
        // {
        //     url: '/clusters/register',
        //     sideMenu: SideMenuItemKey.clusterEditor,
        //     component: ClusterCreator,
        // },
        // {
        //     url: '/clusters/editor',
        //     sideMenu: SideMenuItemKey.clusterEditor,
        //     component: ClusterEditor,
        // },
        // {
        //     url: '/clusters/token',
        //     sideMenu: SideMenuItemKey.clusterEditor,
        //     component: ClusterTokenPage,
        // },
        // {
        //     url: VALIDATORS_PAGE,
        //     sideMenu: SideMenuItemKey.validators,
        //     component: ValidatorsPage,
        //     isDefaultMenuPage: true,
        // },
        // {
        //     url: VALIDATOR_DETAILS_PAGE,
        //     sideMenu: SideMenuItemKey.validators,
        //     component: ValidatorDetailsPage,
        //     isDefaultMenuPage: true,
        // },
        {
            url: RULE_PAGE,
            sideMenu: SideMenuItemKey.rules,
            component: RulesPage,
            isDefaultMenuPage: true,
        },
        {
            url: '/markers',
            sideMenu: SideMenuItemKey.markers,
            component: MarkersPage,
            isDefaultMenuPage: true,
        },

        // Operational
        {
            url: CLUSTER_BROWSER_PAGE,
            sideMenu: SideMenuItemKey.browser,
            component: ClusterBrowserPage,
        },
        {
            url: '/search',
            sideMenu: SideMenuItemKey.search,
            component: SearchPage,
            isDefaultMenuPage: true,
        },

      

        // // Help
        // {
        //     url: '/support',
        //     sideMenu: SideMenuItemKey.support,
        //     component: SupportPage,
        //     isDefaultMenuPage: true,
        // },

        // // DevTools
        // {
        //     url: '/dev/rest-tool',
        //     sideMenu: SideMenuItemKey.restTool,
        //     component: RestToolPage,
        //     isDefaultMenuPage: true,
        // },
        // {
        //     url: '/dev/websocket-tool',
        //     sideMenu: SideMenuItemKey.websocketTool,
        //     component: WebsocketTool,
        //     isDefaultMenuPage: true,
        // },
    ],
};
