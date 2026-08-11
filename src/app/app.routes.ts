import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'user-management' },
  {
    path: 'user-management',
    loadChildren: () =>
      import('./pages/user-management/user-management.routes')
        .then(m => m.USER_MANAGEMENT_ROUTES)
  },
  {
    path: 'todo-list',
    loadChildren: () =>
      import('./pages/todo-list/todo-list.routes')
        .then(m => m.TODO_LIST_ROUTES)
  }
];
