import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { supervisorGuard } from './guards/supervisor.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/tracking/tracking.component').then(
        (component) => component.TrackingComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(
        (component) => component.LoginComponent,
      ),
  },
  {
    path: 'register',
    canActivate: [authGuard, supervisorGuard],
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (component) => component.RegisterComponent,
      ),
  },
  {
    path: 'shipments',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/shipments/shipments.component').then(
        (component) => component.ShipmentsComponent,
      ),
  },
  {
    path: 'shipments/create',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/create-shipment/create-shipment.component').then(
        (component) => component.CreateShipmentComponent,
      ),
  },
  {
    path: 'shipments/:id',
    canActivate: [authGuard],
    loadComponent: () => 
      import('./pages/shipment-detail/shipment-detail.component').then(
        (component) => component.ShipmentDetailComponent,
      ),
  },
];
