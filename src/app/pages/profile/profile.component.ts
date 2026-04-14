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
  // account statistics derived from system
  stats = {
    activity: 0,
    comments: 0,
    reports: 0,
    rating: 0,
    createdCount: 0
  };

  // change password dialog state
  showChangePasswordDialog = false;
  cpCurrent: string = '';
  cpNew: string = '';
  cpConfirm: string = '';

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
    // track created tickets to compute stats (only those created by current user)
    this.ticketService.getCreatedTickets().subscribe(created => {
      try {
        const uid = this.user?.id ? String(this.user.id) : null;
        if (!uid) {
          this.stats.createdCount = 0;
          return;
        }
        this.stats.createdCount = (created || []).filter(t => {
          try {
            if (t.creatorId && String(t.creatorId) === uid) return true;
            if (t.creator && (String(t.creator) === uid || String(t.creator) === this.user?.username || String(t.creator) === this.user?.firstName)) return true;
            return false;
          } catch (e) { return false; }
        }).length;
      } catch (e) {
        this.stats.createdCount = (created || []).length;
      }
    });
  }

  loadAssignedTickets() {
    if (!this.user) {
      this.assignedTickets = [];
      return;
    }
    
    // derive assigned tickets by comparing user id to creator/assignee ids when available
    this.ticketService.getTickets().subscribe(tickets => {
      const uid = this.user?.id ? String(this.user.id) : null;
      this.assignedTickets = (tickets || []).filter(ticket => {
        try {
          if (ticket.assigneeId && uid && String(ticket.assigneeId) === uid) return true;
          if (ticket.creatorId && uid && String(ticket.creatorId) === uid) return true;
          // fallback to name-based comparison
          if (ticket.assignedTo === this.user?.firstName) return true;
          if (ticket.creator === this.user?.username) return true;
          return false;
        } catch (e) { return false; }
      });
      this.updateTicketSummary();
      this.updateAccountStats(tickets || []);
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

  updateAccountStats(allTickets: Ticket[]) {
    // activity: number of tickets the user interacted with (created + assigned)
    const uid = this.user?.id ? String(this.user.id) : null;
    // compute comments and history counts across assignedTickets
    let comments = 0;
    let historyCount = 0;
    for (const t of this.assignedTickets) {
      if (Array.isArray(t.comments)) comments += t.comments.length;
      if (Array.isArray(t.history)) historyCount += t.history.length;
    }
    this.stats.comments = comments;
    this.stats.activity = historyCount + (this.assignedTickets.length || 0);
    // reports + rating are not implemented server-side; keep placeholders
    this.stats.reports = 0;
    this.stats.rating = 0;
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

  openChangePassword() {
    this.cpCurrent = '';
    this.cpNew = '';
    this.cpConfirm = '';
    this.showChangePasswordDialog = true;
  }

  passwordCriteria(pw: string) {
    const s = pw || '';
    return {
      length: s.length >= 8,
      lower: /[a-z]/.test(s),
      upper: /[A-Z]/.test(s),
      digit: /\d/.test(s),
      special: /[^A-Za-z0-9]/.test(s)
    };
  }

  passwordValidationErrors(pw: string) {
    const c = this.passwordCriteria(pw);
    const errs: string[] = [];
    if (!c.length) errs.push('Mínimo 8 caracteres');
    if (!c.lower) errs.push('Al menos una minúscula');
    if (!c.upper) errs.push('Al menos una mayúscula');
    if (!c.digit) errs.push('Al menos un número');
    if (!c.special) errs.push('Al menos un carácter especial');
    return errs;
  }

  async changePassword() {
    if (!this.user || !this.user.id) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Usuario no identificado' });
      return;
    }

    // validate
    if (!this.cpCurrent || !this.cpNew || !this.cpConfirm) {
      this.messageService.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Rellena todos los campos' });
      return;
    }

    if (this.cpNew !== this.cpConfirm) {
      this.messageService.add({ severity: 'warn', summary: 'Contraseñas no coinciden', detail: 'La nueva contraseña y su confirmación deben coincidir' });
      return;
    }

    const errs = this.passwordValidationErrors(this.cpNew || '');
    if (errs.length) {
      this.messageService.add({ severity: 'warn', summary: 'Contraseña débil', detail: errs.join(', ') });
      return;
    }

    try {
      const ok = await this.profileService.updateUser({ id: this.user.id, password: this.cpNew, currentPassword: this.cpCurrent });
      if (ok) {
        this.messageService.add({ severity: 'success', summary: 'Contraseña actualizada', detail: 'Tu contraseña ha sido actualizada' });
        this.showChangePasswordDialog = false;
        this.cpCurrent = this.cpNew = this.cpConfirm = '';
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la contraseña en el servidor. Se intentó guardar localmente.' });
      }
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error inesperado al actualizar contraseña' });
    }
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
      const errs = this.passwordValidationErrors(pw);
      if (errs.length) {
        this.messageService.add({ severity: 'warn', summary: 'Contraseña débil', detail: errs.join(', '), styleClass: 'custom-toast' });
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
    // open password prompt dialog for deletion
    this.openDeleteDialog();
  }

  // delete dialog state
  showDeleteDialog = false;
  deletePassword = '';

  openDeleteDialog() {
    this.deletePassword = '';
    this.showDeleteDialog = true;
  }

  async confirmDeleteAccount() {
    if (!this.user || !this.user.id) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Usuario no identificado' });
      return;
    }
    if (!this.deletePassword) {
      this.messageService.add({ severity: 'warn', summary: 'Contraseña requerida', detail: 'Ingresa tu contraseña para confirmar eliminación' });
      return;
    }

    const ok = await this.profileService.deleteUser(this.deletePassword);
    if (ok) {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cuenta eliminada correctamente', styleClass: 'custom-toast' });
      this.showDeleteDialog = false;
      setTimeout(() => this.router.navigate(['/login']), 1200);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la cuenta. Revisa tu contraseña.' });
    }
  }
}
