import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.css']
})
export class TicketCreateComponent {
  createForm: FormGroup;
  priorities: Ticket['priority'][] = ['1 - Urgente', '2 - Alta', '3 - Media', '4 - Baja'];
  statuses = ['Pendiente', 'En progreso', 'Revisión', 'Hecho'];

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router
  ) {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['Pendiente'],
      assignedTo: [''],
      priority: ['', Validators.required]
    });
  }

  createTicket(): void {
    if (this.createForm.valid) {
      const newTicket: Ticket = {
        id: Date.now().toString(),
        title: this.createForm.value.title,
        description: this.createForm.value.description,
        status: this.createForm.value.status,
        assignedTo: this.createForm.value.assignedTo || 'Juan', // Default to current user if not specified
        priority: this.createForm.value.priority,
        createdDate: new Date(),
        creator: 'Juan', // TODO: get from auth service
        comments: [],
        history: []
      };
      this.ticketService.addTicket(newTicket);
      // Navigate to ticket detail
      this.router.navigate(['/group', 'test-group', 'ticket', newTicket.id]);
    }
  }

  cancel(): void {
    this.router.navigate(['/group', 'test-group']);
  }
}