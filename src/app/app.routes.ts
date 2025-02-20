import { Routes } from '@angular/router';

export const routes: Routes = [
  {
  path: 'eventbooking',
  loadComponent: () => import('@/pages/eventbooking/eventbooking.component'),
  data: { title: 'Event Booking' }
  },

  {
    path: '**',
    redirectTo: 'eventbooking',
    pathMatch: 'full'
  }

];
