import { Routes } from '@angular/router';
import { EventInfoComponent } from '@/pages/eventinfo/eventinfo.component';

export const routes: Routes = [
  {
    path: 'eventbooking',
    loadComponent: () => import('@/pages/eventbooking/eventbooking.component').then(m => m.default),
    data: { title: 'Event Booking' }
  },
  {
    path: 'eventinfo',
    loadComponent: () => import('@/pages/eventinfo/eventinfo.component').then(m => m.EventInfoComponent),
    data: { title: 'Event Info' }
  },
  {
    path: 'eventinfo/:id',
    component: EventInfoComponent,
    data: { title: 'Event Info' }
  },
  {
    path: '**',
    redirectTo: 'eventbooking',
    pathMatch: 'full'
  }
];
