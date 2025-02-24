import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventsInfo, Session } from '../../core/interfaces/API-events-info-interfaces';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'eventinfo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './eventinfo.component.html',
  styleUrls: ['./eventinfo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Configura la estrategia de detección de cambios a OnPush
})
export class EventInfoComponent implements OnInit {

  eventsInfo: EventsInfo[] = [];

  constructor(private route: ActivatedRoute,
               private router: Router,
               @Inject(PLATFORM_ID) private platformId: object
              ) { }

  ngOnInit(): void {

    /**
 * Comprueba si el código se está ejecutando en el navegador antes de acceder a sessionStorage.
 * Esto previene errores en entornos donde sessionStorage no está disponible, como en SSR (Server-Side Rendering).
 */
    if (isPlatformBrowser(this.platformId)) {

      this.route.paramMap.subscribe(params => {
        const eventId = params.get('id');
        const savedEventsInfo = sessionStorage.getItem('eventsInfo');
        if (savedEventsInfo) {
          this.eventsInfo = JSON.parse(savedEventsInfo);
        }
        if (window.history.state && window.history.state.eventInfo) {
          this.addEventInfo(window.history.state.eventInfo);
        } else if (!savedEventsInfo) {
          console.error('Event info not passed in state');
          this.router.navigate(['/error']);
        }
      });
    }
  }

  // Agrega la información del evento a la lista de eventos y guarda los cambios
  addEventInfo(eventInfo: EventsInfo): void {

    // Ordenar las sesiones por fecha ascendente
    eventInfo.sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const existingEvent = this.eventsInfo.find(e => e.event.id === eventInfo.event.id);
    if (!existingEvent) {
      this.eventsInfo.push(eventInfo);
      this.initializeQuantities(eventInfo);
      this.saveEventsInfo();
    }
  }

  // Inicializa la cantidad de cada sesión a 0
  initializeQuantities(eventInfo: EventsInfo): void {
    eventInfo.sessions.forEach(session => {
      session.quantity = 0;
    });
  }

  // Guarda la información de los eventos en sessionStorage
  saveEventsInfo(): void {
    sessionStorage.setItem('eventsInfo', JSON.stringify(this.eventsInfo));
  }

  // Incrementa la cantidad de una sesión si no supera la disponibilidad
  increment(session: Session): void {
    const availability = parseInt(session.availability);
    if (session.quantity !== undefined && session.quantity < availability) {
      session.quantity++;
      this.saveEventsInfo();
    }
  }

  // Decrementa la cantidad de una sesión si es mayor que 0
  decrement(session: Session): void {
    if (session.quantity !== undefined && session.quantity > 0) {
      session.quantity--;
      this.saveEventsInfo();
    }
  }

  // Reinicia la cantidad de una sesión a 0
  resetSession(session: Session): void {
    session.quantity = 0;
    this.saveEventsInfo();

  }

  // Navega de vuelta a la página principal
  goBack(): void {
    this.router.navigate(['/']);
  }

  // Verifica si hay sesiones con cantidad
  hasSessionsWithQuantity(eventInfo: any): boolean {
    return eventInfo.sessions.some((session: any) => session.quantity && session.quantity > 0);
  }
}
