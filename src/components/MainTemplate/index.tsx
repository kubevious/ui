import React, { FC, ReactNode, useState } from 'react';
import { subscribeToSharedState } from '@kubevious/ui-framework';
import { ErrorBox, Popup, OperationLog } from '@kubevious/ui-components';

import { sharedState } from '../../configureService';
import { RestTool, WebsocketTool, SharedStateDebugger } from '@kubevious/ui-dev-tools';
import { ENDPOINTS } from '../../metadata/endpoints';
import { SideMenuItemKey } from '../../metadata/side-menu';

import { ConfirmationDialog } from '@kubevious/ui-components'
import { HttpClientError } from '@kubevious/http-client'

import { SideMenu } from '../SideMenu';

import styles from './styles.module.css';

export const MainTemplate: FC = ({ children }) => {

    const [isCollapsed, setCollapsed] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [isError, setIsError] = useState<boolean>(true);

    const [showPopup, setShowPopup] = useState<boolean>(true);
    const [popupContent, setPopupContent] = useState<any>(null);

    const [devToolsPopupContent, setDevToolsPopupContent] = useState<SideMenuItemKey | null>(null);

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

    subscribeToSharedState('dev_tools_popup_content', (content) => {
        setDevToolsPopupContent(content);

        if (content === SideMenuItemKey.restTool) {
            sharedState.set('endpoints', ENDPOINTS);
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

    const closeDevToolsPopup = () => sharedState.set('dev_tools_popup_content', null);

    const devToolsContent: Record<string, ReactNode> = {
        [SideMenuItemKey.sharedStateDebugger]: <SharedStateDebugger />,
        [SideMenuItemKey.websocketTool]: <WebsocketTool />,
        [SideMenuItemKey.restTool]: <RestTool />,
    };

    return (<div className={styles.mainContainer}>
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

        {devToolsPopupContent && (
            <Popup popupContent={devToolsContent[devToolsPopupContent!]} closePopup={closeDevToolsPopup} />
        )}

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