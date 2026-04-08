import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SidebarService } from '../../services/sidebar.service';
import { ProfileService, UserProfile } from '../../services/profile.service';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    InputTextModule,
    FormsModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  isEditing = false;
  user: UserProfile | null = null;
  editingUser: UserProfile | null = null;
  assignedTickets: Ticket[] = [];
  ticketSummary = {
    pendiente: 0,
    'en progreso': 0,
    revisión: 0,
    hecho: 0
  };

  constructor(
    public sidebarService: SidebarService,
    private profileService: ProfileService,
    private ticketService: TicketService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    const currentUser = this.profileService.getCurrentUser();
    this.user = currentUser;
    this.editingUser = currentUser ? { ...currentUser } : null;
  }

  ngOnInit() {
    this.profileService.user$.subscribe(user => {
      this.user = user;
      this.loadAssignedTickets();
    });
    this.loadAssignedTickets();
  }

  loadAssignedTickets() {
    if (!this.user) {
      this.assignedTickets = [];
      return;
    }
    
    this.ticketService.getTickets().subscribe(tickets => {
      this.assignedTickets = tickets.filter(ticket => 
        ticket.assignedTo === this.user?.firstName || ticket.creator === this.user?.username
      );
      this.updateTicketSummary();
    });
  }

  updateTicketSummary() {
    this.ticketSummary = {
      pendiente: 0,
      'en progreso': 0,
      revisión: 0,
      hecho: 0
    };
    this.assignedTickets.forEach(ticket => {
      const status = ticket.status.toLowerCase();
      if (status in this.ticketSummary) {
        this.ticketSummary[status as keyof typeof this.ticketSummary]++;
      }
    });
  }

  openTicketDetail(ticket: Ticket) {
    if (ticket.groupId) {
      this.router.navigate(['/group', ticket.groupId, 'ticket', ticket.id]);
    }
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  toggleEdit() {
    if (this.isEditing) {
      this.editingUser = this.user ? { ...this.user } : null;
      this.isEditing = false;
    } else {
      this.editingUser = this.user ? { ...this.user } : null;
      this.isEditing = true;
    }
  }

  saveProfile() {
    if (!this.editingUser) return;
    
    // Validar campos obligatorios
    if (!this.editingUser.username || !this.editingUser.firstName || !this.editingUser.lastName || !this.editingUser.email || !this.editingUser.phone || !this.editingUser.address || !this.editingUser.birthDate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos inválidos',
        detail: 'Por favor completa todos los campos obligatorios',
        styleClass: 'custom-toast'
      });
      return;
    }

    this.profileService.updateUser(this.editingUser);
    this.user = { ...this.editingUser };
    this.isEditing = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Perfil actualizado correctamente',
      styleClass: 'custom-toast'
    });
  }

  cancelEdit() {
    this.editingUser = this.user ? { ...this.user } : null;
    this.isEditing = false;
  }

  deleteAccount() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
      header: 'Confirmar eliminación de cuenta',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.profileService.deleteUser();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Cuenta eliminada correctamente',
          styleClass: 'custom-toast'
        });
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }
    });
  }
}
