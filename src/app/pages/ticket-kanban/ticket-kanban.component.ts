import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { Router, ActivatedRoute } from '@angular/router';
import { QuickFiltersComponent, QuickFilter } from '../../components/quick-filters/quick-filters.component';
import { PermissionService } from '../../services/permission.service';
import { IfHasPermissionDirective } from '../../directives/if-has-permission.directive';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-ticket-kanban',
  standalone: true,
  imports: [CommonModule, QuickFiltersComponent, IfHasPermissionDirective],
  providers: [MessageService],
  templateUrl: './ticket-kanban.component.html',
  styleUrls: ['./ticket-kanban.component.css']
})
export class TicketKanbanComponent implements OnInit, OnChanges {
  @Input() groupId: string | null = null;
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  pending: Ticket[] = [];
  inProgress: Ticket[] = [];
  review: Ticket[] = [];
  done: Ticket[] = [];
  currentFilter: QuickFilter = 'all';
  draggedTicket: Ticket | null = null;
  draggedFrom: string | null = null;

  constructor(
    private ticketService: TicketService,
    private router: Router,
    private route: ActivatedRoute,
    private permissionService: PermissionService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadTickets();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['groupId']) {
      this.loadTickets();
    }
  }

  private loadTickets(): void {
    if (this.groupId) {
      this.ticketService.getTicketsForGroup(this.groupId).subscribe(tickets => {
        this.tickets = tickets;
        this.applyFilter();
      });
    } else {
      this.ticketService.getTickets().subscribe(tickets => {
        this.tickets = tickets;
        this.applyFilter();
      });
    }
  }

  applyFilter(): void {
    let filtered = [...this.tickets];

    switch (this.currentFilter) {
      case 'my-tickets':
        filtered = filtered.filter(ticket => ticket.assignedTo === 'Juan'); // TODO: get current user
        break;
      case 'unassigned':
        filtered = filtered.filter(ticket => !ticket.assignedTo || ticket.assignedTo.trim() === '');
        break;
      case 'high-priority':
        filtered = filtered.filter(ticket => ticket.priority.startsWith('1'));
        break;
      case 'all':
      default:
        // No filtering
        break;
    }

    this.filteredTickets = filtered;
    this.updateColumns();
  }

  updateColumns(): void {
    this.pending = this.filteredTickets.filter(t => t.status === 'Pendiente');
    this.inProgress = this.filteredTickets.filter(t => t.status === 'En progreso');
    this.review = this.filteredTickets.filter(t => t.status === 'Revisión');
    this.done = this.filteredTickets.filter(t => t.status === 'Hecho');
  }

  onFilterChanged(filter: QuickFilter): void {
    this.currentFilter = filter;
    this.applyFilter();
  }

  // Drag and Drop handlers
  onDragStart(event: DragEvent, ticket: Ticket, fromStatus: string): void {
    this.draggedTicket = ticket;
    this.draggedFrom = fromStatus;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', ticket.id);
    }
  }

  onDragEnd(): void {
    this.draggedTicket = null;
    this.draggedFrom = null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, newStatus: Ticket['status']): void {
    event.preventDefault();
    
    if (!this.draggedTicket) return;

    // Update ticket status
    const updatedTicket: Ticket = {
      ...this.draggedTicket,
      status: newStatus
    };

    this.ticketService.updateTicket(updatedTicket);
    
    // Update local state
    const index = this.filteredTickets.findIndex(t => t.id === this.draggedTicket!.id);
    if (index > -1) {
      this.filteredTickets[index].status = newStatus;
    }

    this.updateColumns();
    this.draggedTicket = null;
    this.draggedFrom = null;
  }
  onClick(event: MouseEvent, ticket: Ticket): void {
    event.preventDefault();

    // Only allow navigating to the edit screen if the user has update permissions.
    if (!this.permissionService.hasPermission('ticket.update')) {
      // Silently ignore clicks when the user cannot edit.
      return;
    }

    this.openTicketEdit(ticket);
  }

  openTicketEdit(ticket: Ticket): void {
    const groupId = this.route.snapshot.paramMap.get('id') || 'general';
    this.router.navigate(['/group', groupId, 'ticket', ticket.id, 'edit']);
  }

  deleteTicket(ticket: Ticket, event: Event): void {
    event.stopPropagation(); // Prevent triggering the click on the card
    if (!this.ticketService.canDelete(ticket)) {
      this.messageService.add({ severity: 'warn', summary: 'No permitido', detail: 'No puedes eliminar este ticket' });
      return;
    }
    if (confirm('¿Deseas eliminar este ticket?')) {
      this.ticketService.deleteTicket(ticket.id);
      this.applyFilter(); // Refresh the view
      this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Ticket eliminado correctamente' });
    }
  }
}
