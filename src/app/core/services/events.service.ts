import { inject, Injectable } from '@angular/core';
import { Events } from '../interfaces/API-events-interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventsInfo } from '../interfaces/API-events-info-interfaces';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private readonly BASE_API_URL = '/assets/data';

  events: Events[] = [];

  http = inject(HttpClient);

  constructor() {
    this.events = [];
  }

  getEvents(): Observable<Events[]> {
    return this.http.get<Events[]>(`${this.BASE_API_URL}/events.json`);
  }

  getEventInfo(id: string): Observable<EventsInfo> {
    return this.http.get<any>(`${this.BASE_API_URL}/event-info-${id}.json`);
  }

}
