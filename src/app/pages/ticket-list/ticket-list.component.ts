import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { Router } from '@angular/router';
import { QuickFiltersComponent, QuickFilter } from '../../components/quick-filters/quick-filters.component';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { IfHasPermissionDirective } from '../../directives/if-has-permission.directive';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule, QuickFiltersComponent, IfHasPermissionDirective],
  providers: [MessageService],
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit, OnChanges {
  @Input() groupId: string | null = null; // optional group context
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  filterStatus = '';
  filterPriority = '';
  filterAssigned = '';
  sortBy = 'createdDate';
  sortOrder: 'asc' | 'desc' = 'desc';
  currentFilter: QuickFilter = 'all';
  currentUserName: string = '';

  // permission helpers
  canExport = false; // if user can download their tickets (appears when there are created tickets)
  createdCount = 0; // tracked so we don't subscribe repeatedly

  constructor(
    private ticketService: TicketService, 
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) {
    const currentUser = this.userService.getCurrentUser();
    this.currentUserName = currentUser?.firstName || '';
  }

  ngOnInit(): void {
    this.loadTickets();

    // enable export button and track count when there are created tickets
    this.ticketService.getCreatedTickets().subscribe(created => {
      this.createdCount = created.length;
      this.canExport = this.createdCount > 0;
    });
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
        this.applyFilters();
      });
    } else {
      this.ticketService.getTickets().subscribe(tickets => {
        this.tickets = tickets;
        this.applyFilters();
      });
    }
  }

  applyFilters(): void {
    let filtered = [...this.tickets];

    // Apply quick filter first
    switch (this.currentFilter) {
      case 'my-tickets':
        filtered = filtered.filter(ticket => ticket.assignedTo === this.currentUserName);
        break;
      case 'unassigned':
        filtered = filtered.filter(ticket => !ticket.assignedTo || ticket.assignedTo.trim() === '');
        break;
      case 'high-priority':
        // prioridad 1 (la más alta) comienza con '1'
        filtered = filtered.filter(ticket => ticket.priority.startsWith('1'));
        break;
      case 'all':
      default:
        // No quick filtering
        break;
    }

    // Apply additional filters
    filtered = filtered.filter(ticket => {
      return (!this.filterStatus || ticket.status === this.filterStatus) &&
             (!this.filterPriority || ticket.priority === this.filterPriority) &&
             (!this.filterAssigned || ticket.assignedTo.toLowerCase().includes(this.filterAssigned.toLowerCase()));
    });

    this.filteredTickets = filtered;
    this.sortTickets();
  }

  onFilterChanged(filter: QuickFilter): void {
    this.currentFilter = filter;
    this.applyFilters();

    // recalc export availability when switching filters (count-only)
    this.canExport = this.createdCount > 0;
  }

  sortTickets(): void {
    this.filteredTickets.sort((a, b) => {
      let aVal: any = a[this.sortBy as keyof Ticket];
      let bVal: any = b[this.sortBy as keyof Ticket];

      if (aVal instanceof Date) aVal = aVal.getTime();
      if (bVal instanceof Date) bVal = bVal.getTime();

      if (this.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }

  changeSort(sortBy: string): void {
    if (this.sortBy === sortBy) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortOrder = 'desc';
    }
    this.sortTickets();
  }

  openTicketDetail(ticket: Ticket): void {
    const group = this.groupId ? encodeURIComponent(this.groupId) : 'test-group';
    this.router.navigate(['/group', group, 'ticket', ticket.id]);
  }

  canDelete(ticket: Ticket): boolean {
    return this.ticketService.canDelete(ticket);
  }

  editTicket(ticket: Ticket): void {
    const group = this.groupId ? encodeURIComponent(this.groupId) : 'test-group';
    this.router.navigate(['/group', group, 'ticket', ticket.id, 'edit']);
  }

  deleteTicket(ticket: Ticket): void {
    if (!this.canDelete(ticket)) {
      this.messageService.add({ severity: 'warn', summary: 'No permitido', detail: 'No puedes eliminar este ticket' });
      return;
    }
    if (confirm('¿Deseas eliminar este ticket?')) {
      this.ticketService.deleteTicket(ticket.id);
      this.applyFilters();
      this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Ticket eliminado correctamente' });
    }
  }

  exportMyTickets(): void {
    const json = this.ticketService.exportCreated();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mis-tickets.json';
    a.click();
    URL.revokeObjectURL(url);
  }
}