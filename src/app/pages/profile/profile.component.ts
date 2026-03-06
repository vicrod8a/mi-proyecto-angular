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
  user: UserProfile;
  editingUser: UserProfile;

  constructor(
    public sidebarService: SidebarService,
    private profileService: ProfileService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.user = this.profileService.getCurrentUser();
    this.editingUser = { ...this.user };
  }

  ngOnInit() {
    this.profileService.user$.subscribe(user => {
      this.user = user;
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  toggleEdit() {
    if (this.isEditing) {
      this.editingUser = { ...this.user };
      this.isEditing = false;
    } else {
      this.editingUser = { ...this.user };
      this.isEditing = true;
    }
  }

  saveProfile() {
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

    // Validar que las contraseñas coincidan si se ingresan
    if (this.editingUser.password && this.editingUser.password !== this.editingUser.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden',
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
    this.editingUser = { ...this.user };
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
