import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component')
        .then(m => m.LandingComponent)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/login/login.component')
            .then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./auth/register/register.component')
            .then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component')
        .then(m => m.HomeComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component')
        .then(m => m.ProfileComponent)
  },
  {
    path: 'groups',
    loadComponent: () =>
      import('./pages/groups-management/groups-management')
        .then(m => m.GroupsManagement)
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/user-management/user-management.component')
        .then(m => m.UserManagementComponent)
  },
  {
    path: 'group/:id',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/group-dashboard/group-dashboard.component')
            .then(m => m.GroupDashboardComponent)
      },
      {
        path: 'manage',
        loadComponent: () =>
          import('./pages/groups-management/groups-management')
            .then(m => m.GroupsManagement)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/user-management/user-management.component')
            .then(m => m.UserManagementComponent)
      },
      {
        path: 'reports/:type',
        loadComponent: () =>
          import('./pages/reports/reports.component')
            .then(m => m.ReportsComponent)
      },
      {
        path: 'ticket/:id/edit',
        loadComponent: () =>
          import('./pages/ticket-detail/ticket-detail.component')
            .then(m => m.TicketDetailComponent)
      },
      {
        path: 'ticket/:id',
        loadComponent: () =>
          import('./pages/ticket-detail/ticket-detail.component')
            .then(m => m.TicketDetailComponent)
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./pages/ticket-create/ticket-create.component')
            .then(m => m.TicketCreateComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];