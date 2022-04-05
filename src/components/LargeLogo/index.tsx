import React, { FC } from 'react';

import styles from './styles.module.css';

export const LargeLogo: FC = () => (
    <div className={styles.logoContainer}>
        <img src="/img/logoSquareBig.svg" alt="logo" />
        <span className={styles.logoLabel}>OPEN-SOURCE</span>
    </div>
);
