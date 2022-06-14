import { PagesData } from '../types/page';
import { SideMenuItemKey } from './side-menu-keys';

import { ClusterBrowserPage } from '../pages/operational/ClusterBrowserPage';
import { SearchPage } from '../pages/operational/SearchPage';

import { RulesPage } from '../pages/rules/RulesPage';
import { MarkersPage } from '../pages/rules/MarkersPage';
import { ValidatorsPage } from '@kubevious/ui-validator-config';
import { ValidatorDetailsPage } from  '@kubevious/ui-validator-config';

import { SupportPage } from '../pages/help/Support';
import { UpdatesPage } from '@kubevious/ui-worldvious'
import { AboutPage } from '../pages/help/About';
import { GuardMainPage } from '../pages/operational/GuardMainPage'
import { ValidationChangeDetailsPage } from '@kubevious/ui-guard'
import { GUARD_MAIN_PAGE, GUARD_CHANGE_DETAILS_PAGE } from '@kubevious/ui-guard'

export const CLUSTER_BROWSER_PAGE = "/browser";
export const RULE_PAGE = "/rules";

export const VALIDATORS_PAGE = '/validators';
export const VALIDATOR_DETAILS_PAGE = '/validators/details';

export const pagesData: PagesData<SideMenuItemKey> = {
    pages: [


        // Setup
        {
            url: VALIDATORS_PAGE,
            sideMenu: SideMenuItemKey.validators,
            component: ValidatorsPage,
            isDefaultMenuPage: true,
        },
        {
            url: VALIDATOR_DETAILS_PAGE,
            sideMenu: SideMenuItemKey.validators,
            component: ValidatorDetailsPage,
            isDefaultMenuPage: true,
        },
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
            url: GUARD_MAIN_PAGE,
            sideMenu: SideMenuItemKey.guard,
            component: GuardMainPage,
        },
        {
            url: GUARD_CHANGE_DETAILS_PAGE,
            sideMenu: SideMenuItemKey.guard,
            component: ValidationChangeDetailsPage,
        },
        {
            url: '/search',
            sideMenu: SideMenuItemKey.search,
            component: SearchPage,
            isDefaultMenuPage: true,
        },
      

        // Help
        {
            url: '/support',
            sideMenu: SideMenuItemKey.support,
            component: SupportPage,
            isDefaultMenuPage: true,
        },
        {
            url: '/updates',
            sideMenu: SideMenuItemKey.updates,
            component: UpdatesPage,
            isDefaultMenuPage: true,
        },
        {
            url: '/about',
            sideMenu: SideMenuItemKey.about,
            component: AboutPage,
            isDefaultMenuPage: true,
        },
        

    ],
};
