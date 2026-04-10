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

  // previously used for charts
  showUserDialog = false;
  showPermissionsDialog = false;
  deleteConfirmModalVisible = false;
  isEditing = false;
  selectedUser: User | null = null;
  userToDelete: User | null = null;
  userForm: FormGroup;
  selectedPermissions: string[] = [];
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
      role: ['', Validators.required],
      isActive: [true],
      groups: [[]]
    });
  }

  ngOnInit() {
    this.loadUsers();
    this.loadPermissions();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  async loadUsers() {
    // Try to sync from backend first
    try {
      await this.userService.syncUsers();
    } catch (e) {
      // ignore
    }
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  loadPermissions() {
    this.userService.getPermissions().subscribe(permissions => {
      this.permissions = permissions;
      this.permissionsByCategory = this.userService.getPermissionsByCategory();
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  openNewUserDialog() {
    this.isEditing = false;
    this.selectedUser = null;
    this.userForm.reset({ isActive: true, groups: [] });
    this.showUserDialog = true;
  }

  openEditUserDialog(user: User) {
    this.isEditing = true;
    this.selectedUser = user;
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      groups: user.groups
    });
    this.showUserDialog = true;
  }

  openPermissionsDialog(user: User) {
    this.selectedUser = user;
    this.selectedPermissions = [...user.permissions];
    this.showPermissionsDialog = true;
  }

  saveUser() {
    if (this.userForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor complete todos los campos correctamente'
      });
      return;
    }

    const userData = this.userForm.value;

    // Validate unique username when creating
    if (!this.isEditing) {
      const exists = this.users.find((u) => u.username === userData.username);
      if (exists) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre de usuario ya existe' });
        return;
      }
    }

    if (this.isEditing && this.selectedUser) {
      this.userService.updateUser(this.selectedUser.id, userData);
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario actualizado correctamente'
      });
    } else {
      this.userService.createUser(userData);
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario creado correctamente'
      });
    }

    this.showUserDialog = false;
    this.userForm.reset();
  }

  deleteUser(user: User) {
    this.userToDelete = user;
    this.deleteConfirmModalVisible = true;
  }

  confirmDelete() {
    if (!this.userToDelete) return;
    this.userService.deleteUser(this.userToDelete.id);
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Usuario eliminado correctamente'
    });
    this.closeDeleteModal();
  }

  closeDeleteModal() {
    this.deleteConfirmModalVisible = false;
    this.userToDelete = null;
  }

  savePermissions() {
    if (!this.selectedUser) return;

    // Persist selected permissions to backend via UserService
    (async () => {
      const ok = await this.userService.setPermissionsForUser(this.selectedUser!.id, this.selectedPermissions);
      if (ok) {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Permisos actualizados correctamente' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fallo al actualizar permisos' });
      }

      this.showPermissionsDialog = false;
      this.loadUsers(); // Refresh the list

      // If the current logged-in user had their permissions changed, reapply them.
      const currentUser = this.userService.getCurrentUser();
      if (currentUser && this.selectedUser && currentUser.id === this.selectedUser.id) {
        this.permissionService.setPermissions(this.selectedPermissions);
      }
    })();
  }

  closeUserDialog() {
    this.showUserDialog = false;
    this.userForm.reset();
  }

  closePermissionsDialog() {
    this.showPermissionsDialog = false;
    this.selectedPermissions = [];
  }

  getPermissionNames(permissionIds: string[]): string {
    return permissionIds.map(id => {
      const permission = this.permissions.find(p => p.id === id);
      return permission ? permission.name : id;
    }).join(', ');
  }

  getPermissionBadges(permissionIds: string[] | undefined, limit = 3): string[] {
    if (!permissionIds || permissionIds.length === 0) return [];
    return (permissionIds || [])
      .slice(0, limit)
      .map(id => {
        const permission = this.permissions.find(p => p.id === id);
        return permission ? permission.name : id;
      });
  }

  getRemainingPermissionsCount(permissionIds: string[] | undefined, limit = 3): number {
    if (!permissionIds) return 0;
    return Math.max(0, permissionIds.length - limit);
  }

  getGroupNames(groupIds: string[]): string {
    return groupIds.map(id => {
      const group = this.availableGroups.find(g => g.value === id);
      return group ? group.label : id;
    }).join(', ');
  }

  isSuperAdmin(user: User): boolean {
    return user.permissions ? user.permissions.includes('system.admin') : false;
  }

  togglePermission(permissionId: string) {
    const index = this.selectedPermissions.indexOf(permissionId);
    if (index > -1) {
      this.selectedPermissions.splice(index, 1);
    } else {
      this.selectedPermissions.push(permissionId);
    }
  }

  isGroupSelected(groupId: string): boolean {
    const selectedGroups = this.userForm.get('groups')?.value || [];
    return selectedGroups.includes(groupId);
  }

  toggleGroupSelection(groupId: string) {
    const currentGroups = this.userForm.get('groups')?.value || [];
    const index = currentGroups.indexOf(groupId);

    if (index > -1) {
      currentGroups.splice(index, 1);
    } else {
      currentGroups.push(groupId);
    }

    this.userForm.get('groups')?.setValue([...currentGroups]);
  }

  get totalUsers(): number {
    return this.users.length;
  }

  get activeUsers(): number {
    return this.users.filter(u => u.isActive).length;
  }

  get adminUsers(): number {
    return this.users.filter(u => (u.permissions || []).includes('system.admin')).length;
  }

  canManageUsers(): boolean {
    const currentUser = this.userService.getCurrentUser();
    return currentUser ? ((currentUser.permissions || []).includes('permission.manage') || (currentUser.permissions || []).includes('system.admin')) : false;
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}