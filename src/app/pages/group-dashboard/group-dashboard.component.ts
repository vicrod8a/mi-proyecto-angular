import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { TicketKanbanComponent } from '../ticket-kanban/ticket-kanban.component';
import { TicketListComponent } from '../ticket-list/ticket-list.component';
import { IfHasPermissionDirective } from '../../directives/if-has-permission.directive';
import { PermissionService } from '../../services/permission.service';
import { UserService, User } from '../../services/user.service';
import { GroupService, Group } from '../../services/group.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TicketKanbanComponent,
    TicketListComponent,
    // permission directive used on buttons inside this template
    IfHasPermissionDirective,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    TableModule,
    FormsModule
  ],
  providers: [MessageService],
  templateUrl: './group-dashboard.component.html',
  styleUrl: './group-dashboard.component.css'
})
export class GroupDashboardComponent implements OnInit {
  groupName: string | null = null;
  tickets: Ticket[] = [];
  groupId: string | null = null;
  group: Group | null = null;
  viewMode: 'kanban' | 'list' = 'kanban';

  // Gestión de miembros
  showMembersDialog = false;
  showInviteDialog = false;
  groupMembers: User[] = [];
  invitationCode: string = '';

  // Reactive signals for permission checks.
  ticketRead!: ReturnType<PermissionService['hasPermissionSignal']>;
  canManageGroup!: ReturnType<typeof computed>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    public permissionService: PermissionService,
    private userService: UserService,
    private groupService: GroupService,
    private messageService: MessageService
  ) {
    this.groupId = decodeURIComponent(this.route.snapshot.paramMap.get('id') || '');
  }

  ngOnInit(): void {
    // Initialize permission-derived signals (ensures dependency injection is available)
    this.ticketRead = this.permissionService.hasPermissionSignal('ticket.read');
    this.canManageGroup = computed(() =>
      this.permissionService.hasPermission('group.manage')
    );

    // react to group param changes
    this.route.paramMap.subscribe(async params => {
      this.groupId = decodeURIComponent(params.get('id') || '');
      // Refresh scoped permissions for this group (global + group-specific) BEFORE loading data
      if (this.groupId && this.permissionService && typeof (this.permissionService as any).refreshPermissionsForGroup === 'function') {
        try {
          await (this.permissionService as any).refreshPermissionsForGroup(this.groupId);
        } catch (e) {
          // ignore refresh errors but proceed
        }
      }
      this.loadGroup();
      this.loadGroupTickets();
      this.loadGroupMembers();
    });
  }

  private loadGroup() {
    if (this.groupId) {
      this.group = this.groupService.getGroupById(this.groupId) ?? null;
      
      // Check if user can access this group
      if (this.group) {
        // do not block access to the group dashboard here; actions inside
        // the dashboard are controlled by permission checks per-action.
      }
      
      this.groupName = this.group?.name || null;
    }
  }

  private loadGroupTickets() {
    if (this.groupId) {
      // Ensure we fetch the group's tickets from the server (if authenticated)
      this.ticketService.fetchTicketsForGroup(this.groupId!).then(() => {
        this.ticketService.getTicketsForGroup(this.groupId!).subscribe(tickets => {
          this.tickets = tickets;
        });
      }).catch(() => {
        // fallback to existing observable if fetch fails
        this.ticketService.getTicketsForGroup(this.groupId!).subscribe(tickets => {
          this.tickets = tickets;
        });
      });
    } else {
      this.ticketService.getTickets().subscribe(tickets => {
        this.tickets = tickets;
      });
    }
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
    this.router.navigate(['/group', encodeURIComponent(this.groupId || ''), 'create']);
  }

  setViewMode(mode: 'kanban' | 'list') {
    this.viewMode = mode;
  }

  private loadGroupMembers() {
    if (this.groupId) {
      const memberIds = this.groupService.getGroupMembers(this.groupId);
      this.groupMembers = memberIds.map(id => this.userService.getUserById(id)).filter(user => user !== null) as User[];
    }
  }

  openMembersDialog() {
    this.loadGroupMembers();
    this.showMembersDialog = true;
  }

  closeMembersDialog() {
    this.showMembersDialog = false;
  }

  openInviteDialog() {
    if (this.group) {
      this.invitationCode = this.group.invitationCode || '';
    }
    this.showInviteDialog = true;
  }

  closeInviteDialog() {
    this.showInviteDialog = false;
  }

  regenerateCode() {
    if (this.groupId) {
      const newCode = this.groupService.regenerateInvitationCode(this.groupId);
      this.invitationCode = newCode;
      this.messageService.add({
        severity: 'success',
        summary: 'Código regenerado',
        detail: `Nuevo código: ${newCode}`
      });
    }
  }

  copyCode() {
    navigator.clipboard.writeText(this.invitationCode);
    this.messageService.add({
      severity: 'info',
      summary: 'Copiado',
      detail: 'Código copiado al portapapeles'
    });
  }

  removeMember(userId: string) {
    if (this.groupId && confirm('¿Estás seguro de que deseas remover a este usuario del grupo?')) {
      this.groupService.removeUserFromGroup(userId, this.groupId);
      this.loadGroupMembers();
      this.messageService.add({
        severity: 'success',
        summary: 'Usuario removido',
        detail: 'El usuario ha sido removido del grupo'
      });
    }
  }
}

