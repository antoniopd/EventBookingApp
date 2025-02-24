import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Events } from '@/core/interfaces/API-events-interface';
import { EventsService } from '@/core/services/events.service';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'eventbooking',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './eventbooking.component.html',
  styleUrls: ['./eventbooking.component.scss']
})
export default class EventbookingComponent implements OnInit {

  http = inject(HttpClient);
  events: Events[] = [];

  jsonURL = '/assets/data/events.json';

  constructor(public eventService: EventsService, private router: Router) { }

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
       // Ordenar los eventos por fecha de finalización
      this.events = events.sort((a, b) => parseInt(a.endDate) - parseInt(b.endDate));
      },
      error: (error) => {
        console.error('Error en la suscripción:', error);
      }
    });
  }

  async getEventInfo(eventId: string): Promise<void> {
    try {
       // Convierte el observable devuelto por getEventInfo en una promesa y espera su primer valor
      const eventInfo = await firstValueFrom(this.eventService.getEventInfo(eventId));
      console.log("Event Info", eventInfo);
      // Navega a la ruta '/eventinfo' con el ID del evento y pasa la información del evento en el estado
      this.router.navigate(['/eventinfo', eventId], { state: { eventInfo } });
    } catch (error) {
      // Muestra un mensaje de error si no se puede obtener la información del evento
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "¡INFORMACIÓN DEL EVENTO NO ENCONTRADA!",
      });
      console.error('Error fetching event info:', error);
    }
  }

}
