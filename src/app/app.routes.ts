import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { MonitoriaForm } from './pages/monitoriaForm/monitoriaForm';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    component: Home
  },
  {
    path: 'monitorias/nova',
    component: MonitoriaForm
  },
  {
    path: 'monitorias/editar/:id',
    component: MonitoriaForm
  },
  {
    path: '**',
    redirectTo: 'inicio'
  },
];
