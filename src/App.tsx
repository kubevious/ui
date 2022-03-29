import React, { FC } from 'react';
// import {
//     BrowserRouter,
//     Routes,
//     Route,
//   } from "react-router-dom";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
  
import { NotFoundPage } from './pages/NotFoundPage';
import { WrappedRoute } from './hocs/WrappedRoute';
// import { GlobalHandler } from './logic/global-handler';

import { pagesData } from './metadata/page';

import { api } from './configureService';


export const App: FC = () => (
    <BrowserRouter>
        {/* <GlobalHandler /> */}
        <Switch>
            {/* <Route exact path="/" component={Login} />
            <Route exact path="/logout" component={Logout} />
            <ProtectedRoute path="/auth/callback" exact component={Callback} />
            <ProtectedRoute path={AUTH_SETUP_PAGE} exact component={Setup} />
            <ProtectedRoute path={AUTH_ACCOUNT_SETUP_PAGE} exact component={ProfileSetup} />
            */}

            {pagesData.pages.map((page, index) => (
                <WrappedRoute key={index} path={page.url} component={page.component} exact />
            ))}

            <Route component={NotFoundPage} />

            {/* <Route path="/" element={<NotFoundPage />} /> */}
        </Switch>
    </BrowserRouter>
);
