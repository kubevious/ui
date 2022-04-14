import React, { FC, useState } from 'react';
import { subscribeToSharedState } from '@kubevious/ui-framework';
import { ErrorBox, Popup, OperationLog } from '@kubevious/ui-components';

import { sharedState } from '../../configureService';

import { ConfirmationDialog } from '@kubevious/ui-components'
import { HttpClientError } from '@kubevious/http-client'

import { SideMenu } from '../SideMenu';

import styles from './styles.module.css';
import { SEO } from '../SEO';

export const MainTemplate: FC = ({ children }) => {

    const [isCollapsed, setCollapsed] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [isError, setIsError] = useState<boolean>(true);

    const [showPopup, setShowPopup] = useState<boolean>(true);
    const [popupContent, setPopupContent] = useState<any>(null);

    subscribeToSharedState(['is_error', 'error'], ({ is_error, error }: { is_error: boolean; error: Error | null }) => {
        setIsError(is_error);
        setError(error);

        console.log("[MainTemplate] ERROR: ", error);
        if (error) {
            console.log("[MainTemplate] ERROR toString: ", error.toString());
        }
    });

    subscribeToSharedState('popup_window', (popup_window) => {
        if (popup_window) {
            setShowPopup(true);
            setPopupContent(popup_window.content);
        } else {
            setShowPopup(false);
            setPopupContent(null);
        }
    });

    subscribeToSharedState('is_side_menu_collapsed', (value) => {
        setCollapsed(value);
    })

    const closeError = (): void => {
        sharedState.set('is_error', false);
        sharedState.set('error', null);
    };

    const closePopup = () => {
        sharedState.set('popup_window', null);
    };

    return (<div className={styles.mainContainer}>
        <SEO />
        
        <SideMenu isCollapsed={isCollapsed} />

        <div className={styles.mainComponent}
             >
            {children}
        </div>

        {isError && error && 
            <ErrorBox error={error}
                        closeError={closeError}
                        details={getErrorDetails(error)}
                        refreshRequest={needsRefreshToRecover(error)}
                        />
        }

        {showPopup && <Popup popupContent={popupContent} closePopup={closePopup} />}

        <ConfirmationDialog />

        <OperationLog />
    </div>
    );
};


function getErrorDetails(reason: any)
{
    const error = reason as HttpClientError;

    const details : { name: string, value: string }[] = [];
    if (error.httpUrl) {
        details.push({ name: 'URL', value: error.httpUrl });
    }
    if (error.httpMethod) {
        details.push({ name: 'Method', value: error.httpMethod });
    }
    if (error.httpParams) {
        details.push({ name: 'Params', value: JSON.stringify(error.httpParams) });
    }
    if (error.httpStatusCode) {
        details.push({ name: 'Status Code', value: error.httpStatusCode.toString() });
    }
    if (error.httpStatusText) {
        details.push({ name: 'Status', value: error.httpStatusText });
    }
    return details;
}


function needsRefreshToRecover(reason: any)
{
    const error = reason as HttpClientError;

    const statusCode = error?.httpStatusCode;
    if (statusCode) {
        if ((statusCode >= 500) && (statusCode < 600)) {
            return true;
        }
    }
    
    return false;
}