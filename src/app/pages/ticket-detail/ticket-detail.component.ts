import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Ticket, Comment, HistoryEntry } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
  priorities: Ticket['priority'][] = ['1 - Urgente', '2 - Alta', '3 - Media', '4 - Baja'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private fb: FormBuilder
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
    if (ticketId) {
      this.ticketService.getTickets().subscribe(tickets => {
        this.ticket = tickets.find(t => t.id === ticketId) || null;
        if (this.ticket) {
          this.editForm.patchValue(this.ticket);
          this.checkPermissions();
        }
      });
    }
  }

  checkPermissions(): void {
    if (!this.ticket) return;
    // Assuming current user is stored somewhere, for now assume 'Admin' is creator
    const currentUser = 'Admin'; // TODO: get from auth service
    this.canEdit = this.ticket.creator === currentUser;
    this.canChangeStatus = this.canEdit || this.ticket.assignedTo === currentUser;
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
      const newComment: Comment = {
        id: Date.now().toString(),
        user: 'Admin', // TODO: get from auth
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
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        user: 'Admin', // TODO: get from auth
        action,
        date: new Date()
      };
      this.ticket.history.push(entry);
      this.ticketService.updateTicket(this.ticket);
    }
  }

  goBack(): void {
    this.router.navigate(['/group', 'test-group']);
  }
}