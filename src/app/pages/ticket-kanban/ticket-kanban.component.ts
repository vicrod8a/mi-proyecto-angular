import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { Router } from '@angular/router';
import { QuickFiltersComponent, QuickFilter } from '../../components/quick-filters/quick-filters.component';

@Component({
  selector: 'app-ticket-kanban',
  standalone: true,
  imports: [CommonModule, QuickFiltersComponent],
  templateUrl: './ticket-kanban.component.html',
  styleUrls: ['./ticket-kanban.component.css']
})
export class TicketKanbanComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  pending: Ticket[] = [];
  inProgress: Ticket[] = [];
  review: Ticket[] = [];
  done: Ticket[] = [];
  currentFilter: QuickFilter = 'all';

  constructor(private ticketService: TicketService, private router: Router) { }

  ngOnInit(): void {
    this.ticketService.getTickets().subscribe(tickets => {
      this.tickets = tickets;
      this.applyFilter();
    });
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

  onDrop(event: any, newStatus: Ticket['status']): void {
    // Simplified: for now, drag drop is not implemented
    // In a real implementation, use proper drag drop library
  }

  openTicketDetail(ticket: Ticket): void {
    this.router.navigate(['/group', 'test-group', 'ticket', ticket.id]);
  }
}