import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Ticket, Comment, HistoryEntry } from '../../models/ticket.model';
import { UserService } from '../../services/user.service';
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
  priorities: Ticket['priority'][] = ['1 - Urgente', '2 - Alta', '3 - Media', '4 - Baja'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private fb: FormBuilder,
    private userService: UserService,
    private permissionService: PermissionService,
    private messageService: MessageService
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      assignedTo: ['', Validators.required],
      priority: ['', Validators.required],
      deadline: ['']
    });

    this.commentForm = this.fb.group({
      text: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const ticketId = this.route.snapshot.paramMap.get('id');
    const editMode = this.route.snapshot.paramMap.get('edit') !== null;
    console.log('[TicketDetail] ngOnInit - ticketId:', ticketId, 'editMode:', editMode);
    this.isLoading = true;
    this.ticketNotFound = false;
    this.isEditing = editMode; // activate edit mode if edit param is present

    if (ticketId) {
      console.log('[TicketDetail] Fetching tickets...');
      this.ticketService.getTickets().subscribe({
        next: (tickets) => {
          console.log('[TicketDetail] All tickets:', tickets);
          this.ticket = tickets.find(t => t.id === ticketId) || null;
          
          if (this.ticket) {
            console.log('[TicketDetail] Found ticket:', this.ticket);
            this.editForm.patchValue(this.ticket);
            this.checkPermissions();
          } else {
            console.warn('[TicketDetail] Ticket not found with ID:', ticketId, 'among tickets:', tickets.map(t => t.id));
            this.ticketNotFound = true;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('[TicketDetail] Error fetching tickets:', err);
          this.ticketNotFound = true;
          this.isLoading = false;
        }
      });
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

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    if (this.editForm.valid && this.ticket) {
      const updatedTicket = { ...this.ticket, ...this.editForm.value };
      this.ticketService.updateTicket(updatedTicket);
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

  private addHistoryEntry(action: string): void {
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