import React, { FC, useState } from 'react';
import { MainTemplate as BaseMainTemplate } from '@kubevious/ui-components';

import { SideMenuItem, SideMenuSection } from '@kubevious/ui-components';
import { subscribeToSharedState, useForceUpdate, useSharedState } from '@kubevious/ui-framework';
import { SIDE_MENU_DATA } from '../../metadata/side-menu';

import styles from './styles.module.css';
import { SEO } from '../SEO';

export const MainTemplate: FC = ({ children }) => {

    const forceUpdate = useForceUpdate();
    const [mainSections, setMainSections] = useState<SideMenuSection[]>([]);
    const [isCollapsed, setCollapsed] = useState<boolean>(false);

    const sharedState = useSharedState();

    subscribeToSharedState('is_side_menu_collapsed', (value) => {
        setCollapsed(value);
    })

    subscribeToSharedState(
        [
            'dev_tools_enabled',
            'notifications_info'
        ], () => {
        setMainSections(SIDE_MENU_DATA);
        forceUpdate();
    });

    const footerSections : SideMenuItem[] = [];
    footerSections.push({
        key: 'close',
        label: isCollapsed ? 'Expand' : 'Collapse',
        icon: isCollapsed ? 'open.svg' : 'close.svg',
        onClick: () => {
            if (isCollapsed) {
                sharedState?.set('is_side_menu_collapsed', false);
            } else {
                sharedState?.set('is_side_menu_collapsed', true);
            }
        },
    });

    return (
    
        <BaseMainTemplate 
            firstContent={<SEO />}
            sideMenuHeader={<>
                <span className={styles.logoLabel}>OPEN-SOURCE</span>
                <img src="/img/logoBig.svg" alt="logo" />
            </>}
            sideMenuCollapsedHeader={<>
                <img src="/img/logoSmall.svg" alt="logo" />
            </>}
            sideMenuSections={mainSections}
            sideMenuFooter={footerSections}
            >
            
            {children}
            
        </BaseMainTemplate>
    );
};
