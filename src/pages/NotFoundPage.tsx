import React from 'react';
import { PageLinkButton } from '@kubevious/ui-components';
import { PageTemplate } from '../hocs/PageTemplate';
import { LargeLogo } from '../components/LargeLogo';

export const NotFoundPage = () => (
    <PageTemplate>
        <div style={{ marginBottom: '30px' }}>
            <LargeLogo />
        </div>

        <div
            style={{
                fontSize: '80px',
                lineHeight: '94px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '10px',
                textTransform: 'uppercase',
            }}
        >
            404 error
        </div>

        <div
            style={{
                fontSize: '20px',
                lineHeight: '24px',
                fontWeight: 'bold',
                color: '#CCCCCC',
                marginBottom: '40px',
            }}
        >
            Sorry, the page you are looking for doesn't exist.
        </div>

        <div>
            <PageLinkButton path="/">Go to Home</PageLinkButton>
        </div>
        
    </PageTemplate>
);
