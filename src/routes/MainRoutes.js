import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from '../layout/MainLayout/index';
import { AddProduct } from 'pages/components/AddProduct/index';
import RolePage from 'pages/components/RolePage';
import NotFound from 'pages/components/NotFound';
import MediaPage from 'pages/components/MediaPage';
import ListScreenPage from 'pages/components/ListScreenPage';
import BannerPage from 'pages/components/Banner';
import ActionPage from 'pages/components/ActionPage';
import InfoProductPage from 'pages/components/InfoProductPage';
import TagPage from 'pages/components/TagPage';
import UserInfo from 'pages/components/UserInfo';
import RoleAction from 'pages/components/RoleAction';
import { AddCategory } from 'pages/components/AddCategory/index';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components/CategoryPage')));
const Color = Loadable(lazy(() => import('pages/components/ProductPage')));
const Shadow = Loadable(lazy(() => import('pages/components/OrderPage')));
const AccountPage = Loadable(lazy(() => import('pages/components/AccountPage')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: '/role',
            element: <RolePage />
        },
        {
            path: '/product',
            element: <Color />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />
                }
            ]
        },
        ,
        {
            path: 'media',
            element: <MediaPage />
        },
        ,
        {
            path: 'listscreen',
            element: <ListScreenPage />
        },
        {
            path: 'sample-page',
            element: <SamplePage />
        },
        {
            path: 'orders',
            element: <Shadow />
        },
        {
            path: 'category',
            element: <Typography />
        },
        {
            path: 'accounts',
            element: <AccountPage />
        },
        {
            path: 'createProduct',
            element: <AddProduct />
        },
        {
            path: 'createCategory',
            element: <AddCategory />
        },
        {
            path: 'tag',
            element: <TagPage />
        },
        {
            path: 'roleaction',
            element: <RoleAction />
        },
        {
            path: 'infoProduct',
            element: <InfoProductPage />
        },
        {
            path: 'banner',
            element: <BannerPage />
        },
        {
            path: 'action',
            element: <ActionPage />
        },
        {
            path: 'userInfo',
            element: <UserInfo />
        },
        ,
        {
            path: '*',
            element: <NotFound />
        }
    ]
};

export default MainRoutes;
