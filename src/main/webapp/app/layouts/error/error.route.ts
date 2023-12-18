import { Routes } from '@angular/router';

import ErrorComponent from './error.component';

export const errorRoute: Routes = [
  {
    path: 'error',
    component: ErrorComponent,
    title: 'Strona błędu!',
  },
  {
    path: 'accessdenied',
    component: ErrorComponent,
    data: {
      errorMessage: 'Nie masz praw dostępu do tej strony.',
    },
    title: 'Strona błędu!',
  },
  {
    path: '404',
    component: ErrorComponent,
    data: {
      errorMessage: 'Strona nie istnieje.',
    },
    title: 'Strona błędu!',
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];
