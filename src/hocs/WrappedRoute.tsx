import React, { ComponentType, FC } from 'react';
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom';
import { MainTemplate } from '../components/MainTemplate';

export interface ProtectedWrappedRouteProps extends RouteProps {
    component: ComponentType<RouteComponentProps>;
}

export const WrappedRoute: FC<ProtectedWrappedRouteProps> = ({ component, ...rest }) => {

    const element = React.createElement(component);

    return (<Route
            {...rest}
            render={(props) => {

                return (
                    <MainTemplate>
                        {element}
                    </MainTemplate>
                );
            }}
        />
    );

}