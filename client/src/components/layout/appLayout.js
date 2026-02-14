import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import classes from './appLayout.module.css';
import LoadingPage from '../templates/loadingPage';

const Header = React.lazy(() => import("./header"));
const Footer = React.lazy(() => import('./footer'));

const AppLayout = () => {
    return (
        <Suspense fallback={<LoadingPage/>}>
            <div className={classes.appLayout}>
                <Header />
                <Outlet />
                <Footer />
            </div>
        </Suspense>
    );
};

export default AppLayout;
