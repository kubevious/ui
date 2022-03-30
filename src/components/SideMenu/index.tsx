import _ from 'the-lodash';
import React, { FC, useState } from 'react';
import { SideMenu as BaseSideMenu, SideMenuItem, SideMenuSection } from '@kubevious/ui-components';
import { subscribeToSharedState, useForceUpdate, useSharedState } from '@kubevious/ui-framework';
import { SIDE_MENU_DATA } from '../../metadata/side-menu';

import styles from './styles.module.css';

export interface SideMenuProps {
    isCollapsed: boolean;
}

export const SideMenu: FC<SideMenuProps> = ({ isCollapsed }) => {
    const forceUpdate = useForceUpdate();
    const [mainSections, setMainSections] = useState<SideMenuSection[]>([]);

    const sharedState = useSharedState();

    subscribeToSharedState("dev_tools_enabled", () => {
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
        <BaseSideMenu
            header={<>
                <span className={styles.logoLabel}>OPEN-SOURCE</span>
                <img src="/img/logoBig.svg" alt="logo" />
            </>}
            collapsedHeader={<>
                <img src="/img/logoSmall.svg" alt="logo" />
            </>}
            sections={mainSections}
            footer={footerSections}
            isCollapsed={isCollapsed}
        />
    );
};
