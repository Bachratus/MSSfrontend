import { Authority } from './config/authority.constants';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { errorRoute } from './layouts/error/error.route';

import NavbarComponent from './layouts/navbar/navbar.component';
import LoginComponent from './login/login.component';
import { UsersComponent } from './pages/users/users.component';
import { canActivateGuard } from './shared/auth/authGuard';
import { AuthoritiesComponent } from './pages/authorities/authorities.component';
import { WeeklyReportsComponent } from './pages/weekly-reports/weekly-reports.component';
import { WorkingTimeRecordsComponent } from './pages/working-time-records/working-time-records.component';
import { ProjectsComponent } from './pages/projects/projects.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: NavbarComponent,
          outlet: 'navbar',
        },
        {
          path: '',
          component: LoginComponent,
          canActivate: [canActivateGuard],
        },
        {
          path: 'users',
          component: UsersComponent,
          canActivate: [canActivateGuard],
          data: { roles: [Authority.ADMIN, Authority.USERS_ADMINISTRATION] }
        },
        {
          path: 'authorities',
          component: AuthoritiesComponent,
          canActivate: [canActivateGuard],
          data: { roles: [Authority.ADMIN, Authority.USERS_ADMINISTRATION] },
        },
        {
          path: 'projects',
          component: ProjectsComponent,
          canActivate: [canActivateGuard],
          data: { roles: [Authority.ADMIN, Authority.PROJECTS_ADMINISTRATION] }
        },
        {
          path: 'weekly-reports',
          component: WeeklyReportsComponent,
          canActivate: [canActivateGuard],
          data: { roles: [Authority.ADMIN, Authority.WEEKLY_REPORTS] }
        },
        {
          path: 'working-time-records',
          component: WorkingTimeRecordsComponent,
          canActivate: [canActivateGuard],
          data: { roles: [Authority.ADMIN, Authority.USER] }
        },
        ...errorRoute,
      ],
      { enableTracing: false, bindToComponentInputs: true }
    ),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
