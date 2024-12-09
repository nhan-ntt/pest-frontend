import { MenuItemModel } from './layout/components/aside/aside-menu/menu-item-model';
import React, { lazy } from 'react';

// const HomePage = lazy(() => import('./pages/_homepage'));
const UserPage = lazy(() => import('./pages/user/user'));
// const EpisodePage = lazy(() => import('./pages/episode/episode'));
const PredictPage = lazy(() => import('./pages/predict/predict'));
const Report = lazy(() => import('./pages/report/report'));
const WarningPage = lazy(() => import('./pages/warning/warning'));
// const GroupPage = lazy(() => import('./pages/group/group'));
const AboutPage = lazy(() => import('./pages/about-page/about-page'));

export const MainRoutes: MenuItemModel[] = [
  // {parent: true, title: 'MENU.DASHBOARD', url: '/dashboard', component: HomePage},

  {
    parent: true,
    title: 'MENU.FORE_CAST',
    url: '/predict-management',
    component: PredictPage,
  },
  {
    parent: true,
    title: 'MENU.REPORT',
    url: '/report-management',
    component: Report,
  },
  {
    parent: true,
    title: 'MENU.USER_MANAGEMENT',
    url: '/user-management',
    component: UserPage,
  },
  {
    parent: true,
    title: 'MENU.ABOUT_IFAWCAST',
    url: '/about',
    component: AboutPage,
  }
  // {
  //   parent: true,
  //   title: 'MENU.SERVICE_MANAGEMENT',
  //   url: '/service-management',
  //   component: ServicePage,
  // },
  // { parent: true, title: 'MENU.GROUP_MANAGEMENT', url: '/group-management', component: GroupPage },
  // {
  //   parent: true,
  //   title: 'MENU.AD_MANAGEMENT',
  //   url: '/advertising-management',
  //   component: HomePage,
  // },
  // { parent: true, title: 'MENU.ADMIN_MANAGEMENT', url: '/admin-management', component: HomePage },
];

export const AdminRoutes: MenuItemModel[] = [
    {
      parent: true,
      title: 'MENU.USER_MANAGEMENT',
      url: '/user-management',
      component: UserPage,
    },
    {
      parent: true,
      title: 'MENU.WARNING_MANAGEMENT',
      url: '/warning-management',
      component: WarningPage,
    },
    {
      parent: true,
      title: 'MENU.ABOUT_IFAWCAST',
      url: '/about',
      component: AboutPage,
    }
  ];
