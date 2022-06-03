import { SideMenuSection } from '@kubevious/ui-components';

import { devToolsSideMenu } from '../logic/dev-tools-initializer';

import { hasWorldviousUpdates } from '../logic/worldvious';

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
                key: 'guard',
                label: 'Guard',
                icon: 'guard.svg',
                url: '/guard',
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
            {
                key: 'updates',
                label: 'Updates',
                icon: 'updates.svg',
                url: '/updates',
                condition: hasWorldviousUpdates,
            },
            {
                key: 'about',
                label: 'About',
                icon: 'about.svg',
                url: '/about',
            },            
        ],
    },

    devToolsSideMenu()
];

