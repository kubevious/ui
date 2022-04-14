import React, { FC } from 'react';
import styles from './styles.module.css';

export const PageTemplate: FC = ({ children }) => <div className={styles.container}>{children}</div>;
