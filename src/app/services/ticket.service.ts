import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ticket, HistoryEntry } from '../models/ticket.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly STORAGE_KEY = 'mi-proyecto-tickets';
  // additionally track tickets created in this session or by user
  private readonly CREATED_KEY = 'mi-proyecto-created-tickets';

  constructor(private userService: UserService) { }

  private ticketsSubject = new BehaviorSubject<Ticket[]>(this.loadTicketsFromStorage());
  public tickets$ = this.ticketsSubject.asObservable();

  private createdSubject = new BehaviorSubject<Ticket[]>(this.loadCreatedFromStorage());
  public created$ = this.createdSubject.asObservable();

  private loadTicketsFromStorage(): Ticket[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const tickets = JSON.parse(stored);
        // Convert date strings back to Date objects
        const converted = tickets.map((t: any) => ({
          ...t,
          createdDate: new Date(t.createdDate),
          deadline: t.deadline ? new Date(t.deadline) : undefined
        }));
        console.log('[TicketService] Loaded tickets from localStorage:', converted);
        return converted;
      } catch (e) {
        console.warn('[TicketService] Error parsing stored tickets:', e);
      }
    }
    // Return default tickets if nothing in storage
    return this.getDefaultTickets();
  }

  private loadCreatedFromStorage(): Ticket[] {
    const stored = localStorage.getItem(this.CREATED_KEY);
    if (stored) {
      try {
        const tickets = JSON.parse(stored);
        const converted = tickets.map((t: any) => ({
          ...t,
          createdDate: new Date(t.createdDate),
          deadline: t.deadline ? new Date(t.deadline) : undefined
        }));
        console.log('[TicketService] Loaded created tickets:', converted);
        return converted;
      } catch (e) {
        console.warn('[TicketService] Error parsing created tickets:', e);
      }
    }
    return [];
  }

  private saveTicketsToStorage(tickets: Ticket[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tickets));
      console.log('[TicketService] Saved tickets to localStorage');
    } catch (e) {
      console.warn('[TicketService] Error saving tickets to localStorage:', e);
    }
  }

  private saveCreatedToStorage(tickets: Ticket[]): void {
    try {
      localStorage.setItem(this.CREATED_KEY, JSON.stringify(tickets));
      console.log('[TicketService] Saved created tickets to localStorage');
    } catch (e) {
      console.warn('[TicketService] Error saving created tickets:', e);
    }
  }

  private getDefaultTickets(): Ticket[] {
    return [
      {
        id: '1',
        title: 'Implementar autenticación con JWT',
        description: 'Crear el sistema de autenticación con JWT para seguridad mejorada',
        status: 'Hecho',
        assignedTo: 'Juan',
        priority: '1 - Urgente',
        createdDate: new Date('2024-01-01'),
        deadline: new Date('2024-01-05'),
        creator: 'Super',
        comments: [],
        history: [],
        groupId: 'equipo-dev'
      },
      {
        id: '2',
        title: 'Diseñar interfaz del dashboard',
        description: 'Crear el diseño mockup del dashboard principal con figma',
        status: 'En progreso',
        assignedTo: 'Ana',
        priority: '2 - Alta',
        createdDate: new Date('2024-01-02'),
        deadline: new Date('2024-01-10'),
        creator: 'Super',
        comments: [],
        history: [],
        groupId: 'ux'
      },
      {
        id: '3',
        title: 'Revisar código del módulo auth',
        description: 'Revisar el código del módulo de autenticación y verificar seguridad',
        status: 'Revisión',
        assignedTo: 'María',
        priority: '2 - Alta',
        createdDate: new Date('2024-01-03'),
        deadline: new Date('2024-01-08'),
        creator: 'Super',
        comments: [],
        history: [],
        groupId: 'equipo-dev'
      },
      {
        id: '4',
        title: 'Escribir tests unitarios',
        description: 'Escribir tests unitarios para todos los componentes principales',
        status: 'Pendiente',
        assignedTo: 'Carlos',
        priority: '3 - Media',
        createdDate: new Date('2024-01-04'),
        deadline: new Date('2024-01-15'),
        creator: 'Super',
        comments: [],
        history: [],
        groupId: 'qa'
      },
      {
        id: '5',
        title: 'Implementar gestión de permisos',
        description: 'Crear sistema de permisos basado en roles para usuarios',
        status: 'En progreso',
        assignedTo: 'Juan',
        priority: '1 - Urgente',
        createdDate: new Date('2024-01-05'),
        deadline: new Date('2024-01-12'),
        creator: 'Super',
        comments: [],
        history: [],
        groupId: 'equipo-dev'
      },
      {
        id: '6',
        title: 'Crear tickets API',
        description: 'Implementar endpoints para la gestión de tickets (sin backend aún)',
        status: 'Pendiente',
        assignedTo: 'Juan',
        priority: '2 - Alta',
        createdDate: new Date('2024-01-06'),
        deadline: new Date('2024-01-20'),
        creator: 'María',
        comments: [],
        history: [],
        groupId: 'equipo-dev'
      },
      {
        id: '7',
        title: 'Soporte para navegador legacy',
        description: 'Implementar compatibilidad con navegadores antiguos',
        status: 'Hecho',
        assignedTo: 'Ana',
        priority: '4 - Baja',
        createdDate: new Date('2024-01-07'),
        deadline: new Date('2024-01-18'),
        creator: 'María',
        comments: [],
        history: [],
        groupId: 'qa'
      },
      {
        id: '8',
        title: 'Reportes de gestión',
        description: 'Crear reportes análiticos para managers y administradores',
        status: 'En progreso',
        assignedTo: 'Ana',
        priority: '2 - Alta',
        createdDate: new Date('2024-01-08'),
        deadline: new Date('2024-01-25'),
        creator: 'María',
        comments: [],
        history: [],
        groupId: 'soporte'
      },
      {
        id: '9',
        title: 'Optimizar base de datos',
        description: 'Optimizar queries y agregar índices para mejor rendimiento',
        status: 'Pendiente',
        assignedTo: '',
        priority: '3 - Media',
        createdDate: new Date('2024-01-09'),
        deadline: new Date('2024-02-01'),
        creator: 'Super',
        comments: [],
        history: [],
        groupId: 'equipo-dev'
      },
      {
        id: '10',
        title: 'Documentación de API',
        description: 'Documentar todas las APIs creadas',
        status: 'Revisión',
        assignedTo: 'Juan',
        priority: '3 - Media',
        createdDate: new Date('2024-01-10'),
        deadline: new Date('2024-01-28'),
        creator: 'María',
        comments: [],
        history: [],
        groupId: 'soporte'
      }
    ];
  }

  getTickets(): Observable<Ticket[]> {
    return this.tickets$;
  }

  /**
   * Tickets explicitly created during session / by users.
   */
  getCreatedTickets(): Observable<Ticket[]> {
    return this.created$;
  }

  /**
   * Return JSON string representing created tickets (use for download).
   */
  exportCreated(): string {
    return JSON.stringify(this.createdSubject.value, null, 2);
  }

  getTicketsForGroup(groupId: string): Observable<Ticket[]> {
    return this.tickets$.pipe(
      map(tickets => tickets.filter(t => t.groupId === groupId))
    );
  }

  updateTicket(ticket: Ticket): void {
    const tickets = this.ticketsSubject.value;
    const index = tickets.findIndex(t => t.id === ticket.id);
    if (index !== -1) {
      // Registrar cambios automáticamente
      const oldTicket = tickets[index];
      this.trackChanges(ticket, oldTicket);
      tickets[index] = ticket;
      this.saveTicketsToStorage(tickets);
      this.ticketsSubject.next([...tickets]);
    }
  }

  /**
   * Registra automáticamente los cambios entre el ticket antiguo y el nuevo
   */
  private trackChanges(newTicket: Ticket, oldTicket: Ticket): void {
    const currentUser = this.getCurrentUserName();
    const fieldsToCheck: (keyof Ticket)[] = ['title', 'description', 'status', 'assignedTo', 'priority', 'deadline'];

    fieldsToCheck.forEach(field => {
      const oldValue = oldTicket[field];
      const newValue = newTicket[field];

      // Solo registrar si hubo cambio
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        const entry: HistoryEntry = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          user: currentUser,
          action: `Changed ${field}`,
          field: field,
          oldValue: this.formatValue(oldValue),
          newValue: this.formatValue(newValue),
          date: new Date()
        };
        newTicket.history.push(entry);
      }
    });
  }

  /**
   * Formatea un valor para mostrar en el historial
   */
  private formatValue(value: any): string {
    if (value === null || value === undefined) {
      return '(vacío)';
    }
    if (value instanceof Date) {
      return value.toLocaleDateString('es-ES');
    }
    return String(value);
  }

  addTicket(ticket: Ticket): void {
    const tickets = this.ticketsSubject.value;
    tickets.push(ticket);
    this.saveTicketsToStorage(tickets);
    this.ticketsSubject.next([...tickets]);

    // also track created list
    const created = this.createdSubject.value;
    created.push(ticket);
    this.saveCreatedToStorage(created);
    this.createdSubject.next([...created]);
  }

  deleteTicket(id: string): void {
    const tickets = this.ticketsSubject.value.filter(t => t.id !== id);
    this.saveTicketsToStorage(tickets);
    this.ticketsSubject.next(tickets);

    // also remove from created list if present
    const created = this.createdSubject.value.filter(t => t.id !== id);
    this.saveCreatedToStorage(created);
    this.createdSubject.next(created);
  }

  /**
   * Decide whether current user may delete given ticket.
   * Super admins can delete anything; otherwise only creator may remove.
   */
  canDelete(ticket: Ticket): boolean {
    const current = this.userService.getCurrentUser();
    if (!current) {
      return false;
    }
    // super admin always allowed
    if ((current.permissions || []).includes('system.admin')) {
      return true;
    }
    // check creator matches username or firstName (backwards compatibility)
    return ticket.creator === current.username || ticket.creator === current.firstName;
  }

  /**
   * Decide whether current user may edit given ticket.
   * Super admins can edit anything; otherwise only creator may edit.
   */
  canEdit(ticket: Ticket): boolean {
    const current = this.userService.getCurrentUser();
    if (!current) {
      return false;
    }
    // super admin always allowed
    if ((current.permissions || []).includes('system.admin')) {
      return true;
    }
    // check creator matches username or firstName (backwards compatibility)
    return ticket.creator === current.username || ticket.creator === current.firstName;
  }

  /**
   * Get the current user's display name
   */
  getCurrentUserName(): string {
    const current = this.userService.getCurrentUser();
    return current?.firstName || current?.username || 'Admin';
  }
}