import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SidebarService } from '../../services/sidebar.service';
import { UserService, User, Permission } from '../../services/user.service';
import { IfHasPermissionDirective } from '../../directives/if-has-permission.directive';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    IfHasPermissionDirective
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit, OnDestroy {
  users: User[] = [];
  permissions: Permission[] = [];
  permissionsByCategory: { [category: string]: Permission[] } = {};

  showUserDialog = false;
  showPermissionsDialog = false;
  deleteConfirmModalVisible = false;
  isEditing = false;
  selectedUser: User | null = null;
  userToDelete: User | null = null;
  userForm: FormGroup;
  selectedPermissions: string[] = [];
  savingPermissions = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  get canManagePermissions(): boolean {
    return this.permissionService.hasPermission('permission.manage');
  }

  availableGroups = [
    { label: 'Equipo Dev', value: 'equipo-dev' },
    { label: 'Soporte', value: 'soporte' },
    { label: 'UX', value: 'ux' },
    { label: 'QA', value: 'qa' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Ventas', value: 'ventas' }
  ];

  constructor(
    public sidebarService: SidebarService,
    private userService: UserService,
    private permissionService: PermissionService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      isActive: [true],
      password: [''],
      confirmPassword: [''],
      phone: [''],
      address: [''],
      birthDate: ['']
    });
    this.showPassword = false;
    this.showConfirmPassword = false;
  }

  ngOnInit() {
    this.loadUsers();
    this.loadPermissions();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  async loadUsers() {
    try { await this.userService.syncUsers(); } catch (e) { /* ignore */ }
    this.userService.getUsers().subscribe(users => { this.users = users; });
  }

  loadPermissions() {
    this.userService.getPermissions().subscribe(permissions => {
      // Exclude ticket-scoped permissions from the global user-permissions panel.
      const filtered = (permissions || []).filter(p => !String(p.id).startsWith('ticket.'));
      this.permissions = filtered;
      // Build categories from filtered permissions
      const byCat = (this.userService.getPermissionsByCategory() || {});
      // Remove any ticket category if present
      if (byCat['Tickets']) delete byCat['Tickets'];
      // Also filter items inside categories to ensure ticket.* removed
      Object.keys(byCat).forEach(cat => {
        byCat[cat] = (byCat[cat] || []).filter((perm: any) => !String(perm.id).startsWith('ticket.'));
        if (!byCat[cat] || byCat[cat].length === 0) delete byCat[cat];
      });
      this.permissionsByCategory = byCat;
    });
  }

  toggleSidebar() { this.sidebarService.toggleSidebar(); }

  openNewUserDialog() {
    this.isEditing = false;
    this.selectedUser = null;
    this.userForm.reset({ isActive: true });
    this.showUserDialog = true;
  }

  async openEditUserDialog(user: User) {
    this.isEditing = true;
    const fresh = await this.userService.fetchUserById(user.id);
    this.selectedUser = fresh || user;
    this.userForm.patchValue({
      username: this.selectedUser.username,
      email: this.selectedUser.email,
      firstName: this.selectedUser.firstName,
      lastName: this.selectedUser.lastName,
      isActive: this.selectedUser.isActive,
      phone: (this.selectedUser as any).phone || '',
      address: (this.selectedUser as any).address || '',
      birthDate: (this.selectedUser as any).birthdate || (this.selectedUser as any).birthDate || ''
    });
    this.showUserDialog = true;
  }

  openPermissionsDialog(user: User) {
    this.selectedUser = user;
    this.selectedPermissions = [...user.permissions];
    this.showPermissionsDialog = true;
  }

  async saveUser() {
    if (this.userForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos correctamente' });
      return;
    }
    const userData = this.userForm.value;
    const payload = { ...userData } as any;
    delete payload.confirmPassword;

    if (!this.isEditing) {
      const exists = this.users.find(u => u.username === userData.username);
      if (exists) { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre de usuario ya existe' }); return; }
      const pw = (userData.password || '').trim();
      const cpw = (userData.confirmPassword || '').trim();
      if (!pw || pw.length < 6) { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La contraseña es requerida (mínimo 6 caracteres)' }); return; }
      if (pw !== cpw) { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden' }); return; }
    }

    if (this.isEditing && this.selectedUser) {
      if (payload.password) {
        const cpw = this.userForm.value.confirmPassword || '';
        if (payload.password !== cpw) { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden' }); return; }
      }
      const ok = await this.userService.persistUserUpdate(this.selectedUser.id, payload);
      if (ok) this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado correctamente' });
      else this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fallo al actualizar usuario' });
    } else {
      const created = await this.userService.createUser(payload as any);
      if (created) this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente' });
      else this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fallo al crear usuario' });
    }

    this.showUserDialog = false;
    this.userForm.reset();
  }

  deleteUser(user: User) {
    this.userToDelete = user;
    this.deleteConfirmModalVisible = true;
  }

  async confirmDelete() {
    if (!this.userToDelete) return;
    try {
      await this.userService.deleteUser(this.userToDelete.id);
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado correctamente' });
      try { await this.loadUsers(); } catch (e) { /* ignore */ }
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fallo al eliminar usuario' });
    } finally {
      this.closeDeleteModal();
    }
  }

  closeDeleteModal() {
    this.deleteConfirmModalVisible = false;
    this.userToDelete = null;
  }

  savePermissions() {
    if (!this.selectedUser) return;
    this.savingPermissions = true;
    this.userService.setPermissionsForUser(this.selectedUser.id, this.selectedPermissions)
      .then(ok => {
        if (ok) {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Permisos actualizados correctamente' });
          this.selectedUser = { ...this.selectedUser!, permissions: [...this.selectedPermissions] } as User;
          // If the current logged-in user updated their own permissions, apply
          // them globally now (after the user finishes interacting) to avoid
          // triggering UI jumps while toggling individual checkboxes.
          const current = this.userService.getCurrentUser();
          if (current && current.id === this.selectedUser.id) {
            this.permissionService.setPermissions([...this.selectedPermissions]);
          }
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fallo al actualizar permisos' });
        }
      })
      .finally(() => {
        this.savingPermissions = false;
        this.showPermissionsDialog = false;
      });
  }

  closeUserDialog() {
    this.showUserDialog = false;
    this.userForm.reset({ isActive: true });
    this.isEditing = false;
    this.selectedUser = null;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  closePermissionsDialog() {
    this.showPermissionsDialog = false;
    this.selectedPermissions = [];
    this.selectedUser = null;
  }

  getPermissionNames(permissionIds: string[]): string {
    return (permissionIds || []).map(id => {
      const permission = this.permissions.find(p => p.id === id);
      return permission ? permission.name : id;
    }).join(', ');
  }

  getPermissionBadges(permissionIds: string[] | undefined, limit = 3): string[] {
    if (!permissionIds || permissionIds.length === 0) return [];
    return permissionIds.slice(0, limit).map(id => {
      const permission = this.permissions.find(p => p.id === id);
      return permission ? permission.name : id;
    });
  }

  getRemainingPermissionsCount(permissionIds: string[] | undefined, limit = 3): number {
    if (!permissionIds) return 0;
    return Math.max(0, permissionIds.length - limit);
  }

  getGroupNames(groupIds: string[]): string {
    if (!groupIds || groupIds.length === 0) return '';
    return groupIds.map(id => this.availableGroups.find(g => g.value === id)?.label || id).join(', ');
  }

  isSuperAdmin(user: User): boolean {
    return (user.permissions || []).includes('system.admin');
  }

  async togglePermission(permissionId: string) {
    const index = this.selectedPermissions.indexOf(permissionId);
    const removing = index > -1;
    if (removing) this.selectedPermissions.splice(index, 1); else this.selectedPermissions.push(permissionId);

    if (!this.selectedUser || !this.canManagePermissions) return;
    this.savingPermissions = true;
    try {
      let ok = false;
      if (removing) ok = await this.userService.removePermissionFromUser(this.selectedUser.id, permissionId);
      else ok = await this.userService.addPermissionToUser(this.selectedUser.id, this.permissions.find(p => p.id === permissionId) || permissionId);

      if (!ok) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fallo al actualizar permisos' });
        if (removing) this.selectedPermissions.push(permissionId); else this.selectedPermissions = this.selectedPermissions.filter(p => p !== permissionId);
      } else {
        const canonical = this.userService.getUserById(this.selectedUser.id)?.permissions || [];
        this.selectedPermissions = [...canonical];
        this.selectedUser = { ...this.selectedUser, permissions: [...canonical] } as User;
        // Do not update PermissionService here to avoid mid-toggle re-renders.
      }
    } finally {
      this.savingPermissions = false;
    }
  }

  isGroupSelected(groupId: string): boolean {
    const selectedGroups = this.userForm.get('groups')?.value || [];
    return selectedGroups.includes(groupId);
  }

  toggleGroupSelection(groupId: string) {
    const currentGroups = this.userForm.get('groups')?.value || [];
    const index = currentGroups.indexOf(groupId);
    if (index > -1) currentGroups.splice(index, 1); else currentGroups.push(groupId);
    this.userForm.get('groups')?.setValue([...currentGroups]);
  }

  get totalUsers(): number { return this.users.length; }
  get activeUsers(): number { return this.users.filter(u => u.isActive).length; }
  get adminUsers(): number { return this.users.filter(u => (u.permissions || []).includes('system.admin')).length; }

  canManageUsers(): boolean {
    const currentUser = this.userService.getCurrentUser();
    return !!currentUser && ((currentUser.permissions || []).includes('permission.manage') || (currentUser.permissions || []).includes('system.admin'));
  }

  objectKeys(obj: any): string[] { return obj ? Object.keys(obj) : []; }
}
