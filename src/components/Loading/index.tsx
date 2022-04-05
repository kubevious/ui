import React, { FC } from 'react';
import ReactLoading from 'react-loading';
import { LargeLogo } from '../LargeLogo';

import styles from './styles.module.css';

export const Loading: FC = () => (
    <div className={styles.setupContainer}>

        <LargeLogo />

        <ReactLoading type="cylon"
                      width='100px'
                      color="#FFFFFF" />
    </div>
    
);
