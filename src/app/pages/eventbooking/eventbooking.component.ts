import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Events } from '@/core/interfaces/API-events-interface';
import { EventsService } from '@/core/services/events.service';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-eventbooking',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './eventbooking.component.html',
  styleUrls: ['./eventbooking.component.scss']
})
export default class EventbookingComponent implements OnInit {

  http = inject(HttpClient);
  events: Events[] = [];

  jsonURL = '/assets/data/events.json';

  constructor(public eventService: EventsService) { }

  ngOnInit(): void {

    this.getEvents();

  }

  getEvents() {
    this.eventService.getEvents().pipe(
      catchError(error => {
        console.error('Error cargando eventos:', error);
        return throwError(() => error);
      })
    ).subscribe({
      next: (events: Events[]) => {
        console.log("Evento data", events);
       // Ordenar los eventos por endDate
      this.events = events.sort((a, b) => parseInt(a.endDate) - parseInt(b.endDate));
      },
      error: (error) => {
        console.error('Error en la suscripción:', error);
      }
    });
  }

}
