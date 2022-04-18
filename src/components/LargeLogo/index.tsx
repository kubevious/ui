import React, { FC } from 'react';

import styles from './styles.module.css';

export const LargeLogo: FC = () => (
    <div className={styles.logoContainer}>
        <div className={styles.logoImg}></div>
        <span className={styles.logoLabel}>OPEN-SOURCE</span>
        <span className={styles.versionLabel}>{(window as any).KUBEVIOUS_VERSION}</span>
    </div>
);
