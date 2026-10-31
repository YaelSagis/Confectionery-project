import { Routes } from '@angular/router';
import { authGuard } from './core/http';

export const routes: Routes = [
  // Public site for customers
  { path: '', title: 'Dolce · קונדיטוריה', loadComponent: () => import('./pages/home/home').then((m) => m.HomePage) },
  { path: 'menu', title: 'Dolce · תפריט', loadComponent: () => import('./pages/menu/menu').then((m) => m.MenuPage) },
  {
    path: 'login',
    title: 'Dolce · כניסת צוות',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginPage),
  },

  // Staff area
  {
    path: 'admin',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        title: 'Dolce · לוח בקרה',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.DashboardPage),
      },
      {
        path: 'recipes',
        title: 'Dolce · מתכונים',
        loadComponent: () => import('./pages/recipes/recipes').then((m) => m.RecipesPage),
      },
      {
        path: 'orders',
        title: 'Dolce · הזמנות',
        loadComponent: () => import('./pages/orders/orders').then((m) => m.OrdersPage),
      },
      {
        path: 'clients',
        title: 'Dolce · לקוחות',
        loadComponent: () => import('./pages/clients/clients').then((m) => m.ClientsPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
