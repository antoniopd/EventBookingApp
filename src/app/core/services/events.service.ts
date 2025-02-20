import { inject, Injectable } from '@angular/core';
import { Events } from '../interfaces/API-events-interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  API_URL = '/assets/data/events.json';

  events: Events[] = [];

  http = inject(HttpClient);

  constructor() {
    this.events = [];
   }

  getEvents() {
    return this.http.get<Events[]>(this.API_URL);
  }

}
