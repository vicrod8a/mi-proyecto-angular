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
  editingFullName: string = '';
  showPassword = false;
  showConfirmPassword = false;
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
      return;
    }

    (async () => {
      // ensure we have the latest canonical values from backend before editing
      try { await this.profileService.refreshCurrentUser(); } catch (e) { /* ignore */ }
      const current = this.profileService.getCurrentUser();
      this.editingUser = current ? { ...current } : (this.user ? { ...this.user } : null);
      this.editingFullName = (this.editingUser ? `${this.editingUser.firstName} ${this.editingUser.lastName}`.trim() : '');
      this.isEditing = true;
    })();
  }

  saveProfile() {
    if (!this.editingUser) return;
    // Set full name into first/last
    const parts = (this.editingFullName || '').trim().split(/\s+/);
    this.editingUser.firstName = parts.shift() || '';
    this.editingUser.lastName = parts.join(' ') || '';
    // Validar campos obligatorios
    if (!this.editingUser.username || !this.editingUser.firstName || !this.editingUser.email) {
      this.messageService.add({ severity: 'warn', summary: 'Campos inválidos', detail: 'Nombre de usuario, nombre y email son obligatorios', styleClass: 'custom-toast' });
      return;
    }

    // Validar fecha de nacimiento (no futura, razonable)
    if (this.editingUser.birthDate) {
      const bd = new Date(this.editingUser.birthDate);
      const now = new Date();
      const earliest = new Date('1900-01-01');
      if (isNaN(bd.getTime()) || bd > now || bd < earliest) {
        this.messageService.add({ severity: 'warn', summary: 'Fecha inválida', detail: 'La fecha de nacimiento debe ser válida y anterior a hoy', styleClass: 'custom-toast' });
        return;
      }
    }

    // Validar contraseña si fue proporcionada
    const pw = (this.editingUser.password || '').trim();
    const cpw = (this.editingUser.confirmPassword || '').trim();
    if (pw) {
      // Requerir mínimo 8 caracteres, mayúscula, minúscula, dígito y carácter especial
      const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!pwRegex.test(pw)) {
        this.messageService.add({ severity: 'warn', summary: 'Contraseña débil', detail: 'La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y un caracter especial', styleClass: 'custom-toast' });
        return;
      }
      if (pw !== cpw) {
        this.messageService.add({ severity: 'warn', summary: 'Contraseñas no coinciden', detail: 'La contraseña y su confirmación deben coincidir', styleClass: 'custom-toast' });
        return;
      }
    }

    // Persist via profile service (which updates userService/local + will call backend if available)
    (async () => {
      const ok = await this.profileService.updateUser(this.editingUser!);
      // read canonical current user from ProfileService so view shows DB-canonical values
      const canonical = this.profileService.getCurrentUser() || (this.editingUser as UserProfile);
      if (ok) {
        this.user = canonical;
        this.editingUser = { ...canonical };
        this.isEditing = false;
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Perfil actualizado correctamente', styleClass: 'custom-toast' });
      } else {
        // even on failure, show the locally-updated values so the user sees immediate feedback
        this.user = canonical;
        this.editingUser = { ...canonical };
        this.isEditing = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el perfil en el servidor. Los cambios se aplicaron localmente.', styleClass: 'custom-toast' });
      }
      // refresh tickets and summaries for updated user
      this.loadAssignedTickets();
    })();
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
