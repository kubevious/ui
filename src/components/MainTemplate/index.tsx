import React, { FC, useState } from 'react';
import { MainTemplate as BaseMainTemplate } from '@kubevious/ui-components';

import { SideMenuSection } from '@kubevious/ui-components';
import { subscribeToSharedState, useForceUpdate } from '@kubevious/ui-framework';
import { SIDE_MENU_DATA } from '../../metadata/side-menu';

import { SEO } from '../SEO';
import { MenuLogo } from '../MenuLogo';

export const MainTemplate: FC = ({ children }) => {

    const forceUpdate = useForceUpdate();
    const [mainSections, setMainSections] = useState<SideMenuSection[]>([]);

    subscribeToSharedState(
        [
            'dev_tools_enabled',
            'notifications_info'
        ], () => {
        setMainSections(SIDE_MENU_DATA);
        forceUpdate();
    });


    return (
        <BaseMainTemplate 
            firstContent={<SEO />}
            sideMenuHeader={<MenuLogo />}
            sideMenuCollapsedHeader={<MenuLogo isSmall />}
            sideMenuSections={mainSections}
            >
            
            {children}
            
        </BaseMainTemplate>
    );
};
