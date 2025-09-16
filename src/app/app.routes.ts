import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'user-management' },
  {
    path: 'user-management',
    loadChildren: () =>
      import('./pages/user-management/user-management.routes')
        .then(m => m.USER_MANAGEMENT_ROUTES)
  }
];
