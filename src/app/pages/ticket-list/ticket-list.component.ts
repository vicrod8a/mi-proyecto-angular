import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { Router } from '@angular/router';
import { QuickFiltersComponent, QuickFilter } from '../../components/quick-filters/quick-filters.component';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule, QuickFiltersComponent],
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  filterStatus = '';
  filterPriority = '';
  filterAssigned = '';
  sortBy = 'createdDate';
  sortOrder: 'asc' | 'desc' = 'desc';
  currentFilter: QuickFilter = 'all';

  constructor(private ticketService: TicketService, private router: Router) { }

  ngOnInit(): void {
    this.ticketService.getTickets().subscribe(tickets => {
      this.tickets = tickets;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let filtered = [...this.tickets];

    // Apply quick filter first
    switch (this.currentFilter) {
      case 'my-tickets':
        filtered = filtered.filter(ticket => ticket.assignedTo === 'Juan'); // TODO: get current user
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
    this.router.navigate(['/group', 'test-group', 'ticket', ticket.id]);
  }
}