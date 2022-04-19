import React, { FC } from 'react';

import styles from './styles.module.css';

export interface MenuLogoProps {
    isSmall?: boolean
}

export const MenuLogo: FC<MenuLogoProps> = ({ isSmall }) => {

    if (isSmall) {
        return (
            <div className={styles.logoContainerSmall}>
                <img src="/img/logoSmall.svg" alt="logo" />
            </div>
        )
    }

    return (
        <div className={styles.logoContainer}>
            <span className={styles.logoLabel}>OPEN-SOURCE</span>
            <img src="/img/logoBig.svg" alt="logo" />
        </div>
    );

}