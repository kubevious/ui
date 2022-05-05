import React, { FC } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
  
import { NotFoundPage } from './pages/NotFoundPage';
import { WrappedRoute } from './hocs/WrappedRoute';
import { GlobalHandler } from './logic/global-handler';

import { pagesData, CLUSTER_BROWSER_PAGE } from './metadata/page';


export const App: FC = () => (
    <BrowserRouter>
        <GlobalHandler />
        <Switch>
            <Redirect exact from="/" to={CLUSTER_BROWSER_PAGE} />

            {pagesData.pages.map((page, index) => (
                <WrappedRoute key={index} path={page.url} component={page.component} exact />
            ))}

            <Route component={NotFoundPage} />
        </Switch>
    </BrowserRouter>
);
