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
    path: 'group',
    loadComponent: () =>
      import('./pages/group/group.component')
        .then(m => m.GroupComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];