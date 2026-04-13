import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { firstValueFrom } from 'rxjs';
import { Ticket, Comment, HistoryEntry } from '../../models/ticket.model';
import { UserService } from '../../services/user.service';
import { GroupService, Group } from '../../services/group.service';
import { PermissionService } from '../../services/permission.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

/**
 * Pipe para invertir arrays (mostrar historial en orden inverso)
 */
@Pipe({
  name: 'reverse',
  standalone: true
})
export class ReversePipe implements PipeTransform {
  transform<T>(array: T[]): T[] {
    if (!array) return array;
    return [...array].reverse();
  }
}

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastModule, ReversePipe],
  providers: [MessageService],
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | null = null;
  editForm: FormGroup;
  commentForm: FormGroup;
  isEditing = false;
  canEdit = false;
  canChangeStatus = false;
  canDelete = false;
  isLoading = true;
  ticketNotFound = false;
  groupMembers: { id: string; displayName: string }[] = [];
  priorities: Ticket['priority'][] = ['1 - Urgente', '2 - Alta', '3 - Media', '4 - Baja'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private fb: FormBuilder,
    private userService: UserService,
    private groupService: GroupService,
    private permissionService: PermissionService,
    private messageService: MessageService
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      assignedTo: [''],
      priority: ['', Validators.required],
      deadline: ['']
    });

    this.commentForm = this.fb.group({
      text: ['', Validators.required]
    });
  }

  objectKeys(obj: any): string[] {
    if (!obj) return [];
    try { return Object.keys(obj); } catch (e) { return []; }
  }

  displayKey(key: string): string {
    if (!key) return '';
    const map: Record<string, string> = {
      'due_date': 'Fecha límite',
      'dueDate': 'Fecha límite',
      'deadline': 'Fecha límite',
      'assignee_user_id': 'Asignado a',
      'assigneeId': 'Asignado a',
      'assignedTo': 'Asignado a',
      'creator_user_id': 'Creador',
      'creatorId': 'Creador',
      'created_at': 'Fecha de creación',
      'createdDate': 'Fecha de creación',
      'updated_at': 'Fecha de actualización',
      'updatedAt': 'Fecha de actualización',
      'title': 'Título',
      'description': 'Descripción',
      'status': 'Estado',
      'priority': 'Prioridad'
    };
    if (map[key]) return map[key];
    // fallback: humanize key
    const human = key.replace(/_/g, ' ').replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    return human.charAt(0).toUpperCase() + human.slice(1);
  }

  formatValue(v: any): string {
    if (v === null || typeof v === 'undefined') return '(vacío)';
    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)) {
      try { return new Date(v).toLocaleString(); } catch (e) { /* ignore */ }
    }
    if (v instanceof Date) return v.toLocaleString();
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
  }

  async formatValueForKey(key: string, value: any): Promise<string> {
    if (value === null || typeof value === 'undefined') return '(vacío)';
    // user id fields -> resolve to user display name when possible
    if (['assignee_user_id', 'assigneeId', 'creator_user_id', 'creatorId', 'user_id'].includes(key)) {
      const id = String(value);
      const u = this.userService.getUserById(id) || await this.userService.fetchUserById(id);
      if (u) return u.firstName || u.username || String(value);
      return String(value);
    }
    // date-like fields -> format as local date
    if (['due_date', 'dueDate', 'deadline', 'created_at', 'createdAt', 'updated_at', 'updatedAt'].includes(key)) {
      try {
        const d = (value instanceof Date) ? value : new Date(String(value));
        if (!isNaN(d.getTime())) return d.toLocaleString();
      } catch (e) {}
      return String(value);
    }
    // fallback to generic formatter
    return this.formatValue(value);
  }

  /**
   * Formatea un valor de fecha para el input[type=date] (YYYY-MM-DD) o devuelve cadena vacía
   */
  deadlineToInput(deadline: any): string {
    if (!deadline) return '';
    try {
      const d = (deadline instanceof Date) ? deadline : new Date(String(deadline));
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  }

  async ngOnInit(): Promise<void> {
    const ticketId = this.route.snapshot.paramMap.get('id');
    // Detect edit mode by presence of 'edit' segment in the URL (route uses /ticket/:id/edit)
    const editMode = (this.route.snapshot.url || []).some(seg => seg.path === 'edit');
    console.log('[TicketDetail] ngOnInit - ticketId:', ticketId, 'editMode:', editMode);
    this.isLoading = true;
    this.ticketNotFound = false;
    this.isEditing = editMode; // activate edit mode if edit param is present

    if (ticketId) {
      console.log('[TicketDetail] Fetching ticket (single-load)...');
      try {
        // First, try to fetch authoritative ticket from the server (includes history)
        const fetched = await this.ticketService.getTicketById(ticketId);
        if (fetched) {
          this.ticket = fetched;
        } else {
          // fallback: read the current tickets store once
          try {
            const tickets = await firstValueFrom(this.ticketService.getTickets());
            this.ticket = tickets.find(t => t.id === ticketId) || null;
          } catch (e) {
            this.ticket = null;
          }
        }

        if (this.ticket) {
          console.log('[TicketDetail] Found ticket:', this.ticket);
          // populate group members dropdown
          this.loadGroupMembers(this.ticket.groupId).catch(() => {});
          // use assigneeId if available for the form; fall back to assignedTo name
          const assignedToValue = (this.ticket as any).assigneeId || this.ticket.assignedTo || '';
          const deadlineStr = this.ticket.deadline ? (this.ticket.deadline instanceof Date ? this.ticket.deadline.toISOString().split('T')[0] : new Date(this.ticket.deadline).toISOString().split('T')[0]) : '';
          this.editForm.patchValue({ title: this.ticket.title, description: this.ticket.description, status: this.ticket.status, assignedTo: assignedToValue, priority: this.ticket.priority, deadline: deadlineStr });
          this.checkPermissions();
        } else {
          console.warn('[TicketDetail] Ticket not found with ID:', ticketId);
          this.ticketNotFound = true;
        }
      } catch (e) {
        console.error('[TicketDetail] Error fetching ticket:', e);
        this.ticketNotFound = true;
      } finally {
        this.isLoading = false;
      }
    } else {
      console.warn('[TicketDetail] No ticket ID provided');
      this.ticketNotFound = true;
      this.isLoading = false;
    }
  }

  checkPermissions(): void {
    if (!this.ticket) return;
    // User can edit only if they have permission AND are the ticket creator (or super admin)
    this.canEdit = this.permissionService.hasPermission('ticket.update') && this.ticketService.canEdit(this.ticket);
    this.canChangeStatus = this.canEdit;
    // User can delete only if they have permission AND are the ticket creator (or super admin)
    this.canDelete = this.permissionService.hasPermission('ticket.delete') && this.ticketService.canDelete(this.ticket);
  }

  private async loadGroupMembers(groupId: string): Promise<void> {
    try {
      const g = this.groupService.getGroupById(groupId);
      const memberIds = (g && Array.isArray(g.membersList)) ? g.membersList.slice() : [];
      const members: { id: string; displayName: string }[] = [];
      for (const id of memberIds) {
        let user = this.userService.getUserById(String(id));
        if (!user) {
          user = await this.userService.fetchUserById(String(id));
        }
        if (user) members.push({ id: String(user.id), displayName: user.firstName || user.username || user.email });
      }
      // if no members found, ensure at least current creator is selectable
      if (members.length === 0 && this.ticket && this.ticket.creator) {
        const cur = this.userService.getUserById(String((this.ticket as any).creatorId || ''));
        if (cur) members.push({ id: String(cur.id), displayName: cur.firstName || cur.username });
      }
      this.groupMembers = members;
    } catch (e) {
      console.warn('[TicketDetail] loadGroupMembers failed', e);
      this.groupMembers = [];
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    if (this.editForm.valid && this.ticket) {
      const formValue = this.editForm.value;
      const updatedTicket: any = { ...this.ticket, ...formValue };
      // assign numeric id from dropdown to assigneeId for server payload
      updatedTicket.assigneeId = formValue.assignedTo || null;
      // update assignedTo display name locally if possible
      const sel = this.groupMembers.find(m => String(m.id) === String(formValue.assignedTo));
      updatedTicket.assignedTo = sel ? sel.displayName : (formValue.assignedTo || '');
      this.ticketService.updateTicket(updatedTicket as Ticket);
      this.isEditing = false;
      this.addHistoryEntry('Updated ticket details');
    }
  }

  changeStatus(newStatus: Ticket['status']): void {
    if (this.ticket && this.canChangeStatus) {
      this.ticket.status = newStatus;
      this.ticketService.updateTicket(this.ticket);
      this.addHistoryEntry(`Changed status to ${newStatus}`);
    }
  }

  addComment(): void {
    if (this.commentForm.valid && this.ticket) {
      const currentUser = this.ticketService.getCurrentUserName();
      const newComment: Comment = {
        id: Date.now().toString(),
        user: currentUser,
        text: this.commentForm.value.text,
        date: new Date()
      };
      this.ticket.comments.push(newComment);
      this.ticketService.updateTicket(this.ticket);
      this.commentForm.reset();
      this.addHistoryEntry('Added a comment');
    }
  }

  public addHistoryEntry(action: string): void {
    if (this.ticket) {
      const currentUser = this.ticketService.getCurrentUserName();
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        user: currentUser,
        action,
        date: new Date()
      };
      this.ticket.history.push(entry);
      this.ticketService.updateTicket(this.ticket);
    }
  }

  goBack(): void {
    if (this.ticket) {
      this.router.navigate(['/group', encodeURIComponent(this.ticket.groupId)]);
    } else {
      this.router.navigate(['/']);
    }
  }

  deleteTicket(): void {
    if (this.ticket && this.canDelete) {
      if (confirm('¿Deseas eliminar este ticket?')) {
        this.ticketService.deleteTicket(this.ticket.id);
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Ticket eliminado correctamente' });
        this.goBack();
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'No permitido', detail: 'No tienes permiso para eliminar este ticket' });
    }
  }
}