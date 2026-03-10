import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private ticketsSubject = new BehaviorSubject<Ticket[]>(this.getInitialTickets());
  public tickets$ = this.ticketsSubject.asObservable();

  constructor() { }

  private getInitialTickets(): Ticket[] {
    return [
      {
        id: '1',
        title: 'Implementar login',
        description: 'Crear el componente de login con validación',
        status: 'Hecho',
        assignedTo: 'Juan',
        priority: '1 - Urgente',
        createdDate: new Date('2024-01-01'),
        deadline: new Date('2024-01-05'),
        creator: 'Admin',
        comments: [],
        history: []
      },
      {
        id: '2',
        title: 'Diseñar dashboard',
        description: 'Crear el diseño del dashboard principal',
        status: 'En progreso',
        assignedTo: 'María',
        priority: '2 - Alta',
        createdDate: new Date('2024-01-02'),
        deadline: new Date('2024-01-10'),
        creator: 'Admin',
        comments: [],
        history: []
      },
      {
        id: '3',
        title: 'Revisar código',
        description: 'Revisar el código del módulo de autenticación',
        status: 'Revisión',
        assignedTo: 'Pedro',
        priority: '3 - Media',
        createdDate: new Date('2024-01-03'),
        deadline: new Date('2024-01-08'),
        creator: 'Admin',
        comments: [],
        history: []
      },
      {
        id: '4',
        title: 'Agregar tests',
        description: 'Escribir tests unitarios para los componentes',
        status: 'Pendiente',
        assignedTo: 'Ana',
        priority: '4 - Baja',
        createdDate: new Date('2024-01-04'),
        deadline: new Date('2024-01-15'),
        creator: 'Admin',
        comments: [],
        history: []
      }
    ];
  }

  getTickets(): Observable<Ticket[]> {
    return this.tickets$;
  }

  updateTicket(ticket: Ticket): void {
    const tickets = this.ticketsSubject.value;
    const index = tickets.findIndex(t => t.id === ticket.id);
    if (index !== -1) {
      tickets[index] = ticket;
      this.ticketsSubject.next([...tickets]);
    }
  }

  addTicket(ticket: Ticket): void {
    const tickets = this.ticketsSubject.value;
    tickets.push(ticket);
    this.ticketsSubject.next([...tickets]);
  }

  deleteTicket(id: string): void {
    const tickets = this.ticketsSubject.value.filter(t => t.id !== id);
    this.ticketsSubject.next(tickets);
  }
}