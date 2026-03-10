import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { TicketKanbanComponent } from '../ticket-kanban/ticket-kanban.component';
import { TicketListComponent } from '../ticket-list/ticket-list.component';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-group-dashboard',
  standalone: true,
  imports: [CommonModule, TicketKanbanComponent, TicketListComponent],
  templateUrl: './group-dashboard.component.html',
  styleUrl: './group-dashboard.component.css'
})
export class GroupDashboardComponent implements OnInit {
  groupName: string | null = null;
  tickets: Ticket[] = [];
  viewMode: 'kanban' | 'list' = 'kanban';
  llmModel = 'GPT-4'; // Example LLM model
  canManageGroup: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private permissionService: PermissionService
  ) {
    this.groupName = decodeURIComponent(this.route.snapshot.paramMap.get('name') || '');
  }

  ngOnInit(): void {
    this.ticketService.getTickets().subscribe(tickets => {
      this.tickets = tickets;
    });

    // Check if user can manage group
    this.canManageGroup = this.permissionService.hasPermission('group:add') ||
                         this.permissionService.hasPermission('group:edit') ||
                         this.permissionService.hasPermission('group:delete');
  }

  counts() {
    const c: Record<string, number> = { pendiente: 0, 'en progreso': 0, hecho: 0, bloqueado: 0 };
    this.tickets.forEach(t => {
      const status = t.status.toLowerCase();
      if (status in c) {
        c[status]++;
      }
    });
    return c;
  }

  recentTickets() {
    return this.tickets.slice(0, 3);
  }

  createTicket() {
    this.router.navigate(['/group', encodeURIComponent(this.groupName || ''), 'create']);
  }

  setViewMode(mode: 'kanban' | 'list') {
    this.viewMode = mode;
  }

  manageGroup() {
    this.router.navigate(['/group', encodeURIComponent(this.groupName || ''), 'manage']);
  }
}
