import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GroupService, Group } from '../../services/group.service';
import { UserService, User } from '../../services/user.service';
import { PermissionService } from '../../services/permission.service';
import { IfHasPermissionDirective } from '../../directives/if-has-permission.directive';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groups-management',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IfHasPermissionDirective, ToastModule],
  providers: [MessageService],
  templateUrl: './groups-management.html',
  styleUrl: './groups-management.css',
})
export class GroupsManagement implements OnInit {
  groups: Group[] = [];
  users: User[] = [];
  groupForm: FormGroup;
  editingGroup: Group | null = null;
  // UI state
  expandedGroupId: string | null = null;
  addMemberEmail: string = '';
  permissionsEditor: { groupId: string | null; userId: string | null; selected: string[] } = { groupId: null, userId: null, selected: [] };
  // Temporary selection for permissions when creating a new group
  newGroupPermissions: string[] = [];

  constructor(
    private groupService: GroupService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService,
    public permissionService: PermissionService
  ) {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      level: ['Básico', Validators.required],
      ownerUserId: ['']
    });
  }

  ngOnInit(): void {
    this.groupService.getGroups().subscribe(groups => {
      this.groups = groups;
    });
    this.userService.getUsers().subscribe(u => this.users = u);
    // ensure available permissions are loaded
    try { this.permissionService.reloadAvailablePermissions(); } catch (e) {}
  }

  getUserDisplayName(userId: string | null): string {
    if (!userId) return '';
    const u = this.userService.getUserById(userId);
    if (!u) return String(userId);
    return u.username || u.email || u.id || String(userId);
  }

  toggleExpand(groupId: string) {
    this.expandedGroupId = this.expandedGroupId === groupId ? null : groupId;
  }

  async addMemberToGroup(group: Group) {
    const email = this.addMemberEmail?.trim();
    if (!email || !email.includes('@')) return this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'Ingresa un correo electrónico válido' });
    try {
      // Try to find user locally
      let user = this.users.find(u => String(u.email).toLowerCase() === String(email).toLowerCase());
      if (!user) {
        // Attempt to sync users from backend then search again
        try { await this.userService.syncUsers(); } catch (e) { /* ignore */ }
        user = this.users.find(u => String(u.email).toLowerCase() === String(email).toLowerCase());
      }
      if (!user) {
        this.messageService.add({ severity: 'error', summary: 'No encontrado', detail: 'No se encontró ningún usuario con ese correo' });
        return;
      }
      await this.groupService.addUserToGroup(String(user.id), group.id);
      this.messageService.add({ severity: 'success', summary: 'Añadido', detail: 'Usuario añadido al grupo' });
      this.addMemberEmail = '';
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo añadir usuario' });
    }
  }

  async removeMemberFromGroup(userId: string, groupId: string) {
    try {
      this.groupService.removeUserFromGroup(userId, groupId);
      this.messageService.add({ severity: 'success', summary: 'Removido', detail: 'Usuario removido del grupo' });
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo remover usuario' });
    }
  }

  openPermissionsEditor(groupId: string, userId?: string) {
    this.permissionsEditor.groupId = groupId;
    this.permissionsEditor.userId = userId || null;
    this.permissionsEditor.selected = [];
    if (userId) {
      // fetch group-scoped permissions from backend
      (async () => {
        try {
          const token = localStorage.getItem('mi-proyecto-token') || localStorage.getItem('supabase.auth.token') || '';
          const API_BASE = 'http://127.0.0.1:3000';
          const res = await fetch(`${API_BASE}/groups/${encodeURIComponent(groupId)}/permissions`, { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
          if (!res.ok) return;
          const body = await res.json().catch(() => null);
          const arr = Array.isArray(body) ? body : (body?.data || body || []);
          const entry = (arr || []).find((e: any) => String(e.user_id) === String(userId));
          if (entry && Array.isArray(entry.permissions)) {
            this.permissionsEditor.selected = entry.permissions.slice();
          }
        } catch (e) {
          // ignore
        }
      })();
    }
  }

  // Return only ticket-related permissions for group-scoped editing
  ticketPermissions(): string[] {
    const avail = this.permissionService.availablePermissions() || [];
    return avail.filter((p: string) => String(p).startsWith('ticket.'));
  }

  toggleNewGroupPermission(permission: string) {
    const idx = this.newGroupPermissions.indexOf(permission);
    if (idx === -1) this.newGroupPermissions.push(permission);
    else this.newGroupPermissions.splice(idx, 1);
  }

  async togglePermissionForUser(permission: string) {
    const gid = this.permissionsEditor.groupId;
    const uid = this.permissionsEditor.userId;
    if (!gid || !uid) return;
    const already = this.permissionsEditor.selected.includes(permission);
    try {
      // Optimistic update: update UI immediately, call backend in background
      const prev = this.permissionsEditor.selected.slice();
      if (already) {
        this.permissionsEditor.selected = prev.filter(p => p !== permission);
        this.userService.removePermissionFromUser(uid, permission, gid).then((ok) => {
          if (!ok) {
            this.permissionsEditor.selected = prev; // revert
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo quitar el permiso' });
          } else {
            this.messageService.add({ severity: 'success', summary: 'Permisos', detail: 'Permiso quitado' });
          }
        }).catch(() => {
          this.permissionsEditor.selected = prev;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo quitar el permiso' });
        });
      } else {
        this.permissionsEditor.selected = [...prev, permission];
        this.userService.addPermissionToUser(uid, { permission, group_id: gid }).then((ok) => {
          if (!ok) {
            this.permissionsEditor.selected = prev;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo añadir el permiso' });
          } else {
            this.messageService.add({ severity: 'success', summary: 'Permisos', detail: 'Permiso añadido' });
          }
        }).catch(() => {
          this.permissionsEditor.selected = prev;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo añadir el permiso' });
        });
      }
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar permiso' });
    }
  }

  /**
   * Assign all ticket.* permissions to the currently selected user in the permissions editor (group-scoped).
   */
  async assignAllTicketPermissionsToEditor(): Promise<void> {
    const gid = this.permissionsEditor.groupId;
    const uid = this.permissionsEditor.userId;
    if (!gid || !uid) return;
    const perms = this.ticketPermissions();
    const prev = this.permissionsEditor.selected.slice();
    const toAdd = perms.filter(p => !this.permissionsEditor.selected.includes(p));
    if (!toAdd.length) {
      this.messageService.add({ severity: 'info', summary: 'Permisos', detail: 'El usuario ya tiene todos los permisos de ticket' });
      return;
    }
    // optimistic update
    this.permissionsEditor.selected = Array.from(new Set([...this.permissionsEditor.selected, ...toAdd]));
    const failed: string[] = [];
    for (const p of toAdd) {
      try {
        const ok = await this.userService.addPermissionToUser(uid, { permission: p, group_id: gid });
        if (!ok) failed.push(p);
      } catch (e) {
        failed.push(p);
      }
    }
    if (failed.length) {
      // revert failed ones
      this.permissionsEditor.selected = prev.slice();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron aplicar algunos permisos: ' + failed.join(', ') });
    } else {
      this.messageService.add({ severity: 'success', summary: 'Permisos', detail: 'Permisos de ticket aplicados correctamente' });
    }
  }

  /**
   * Remove all ticket.* permissions from the currently selected user in the permissions editor (group-scoped).
   */
  async removeAllTicketPermissionsFromEditor(): Promise<void> {
    const gid = this.permissionsEditor.groupId;
    const uid = this.permissionsEditor.userId;
    if (!gid || !uid) return;
    const perms = this.ticketPermissions();
    const toRemove = perms.filter(p => this.permissionsEditor.selected.includes(p));
    if (!toRemove.length) {
      this.messageService.add({ severity: 'info', summary: 'Permisos', detail: 'El usuario no tiene permisos de ticket para quitar' });
      return;
    }
    const prev = this.permissionsEditor.selected.slice();
    // optimistic update
    this.permissionsEditor.selected = prev.filter(p => !toRemove.includes(p));
    const failed: string[] = [];
    for (const p of toRemove) {
      try {
        const ok = await this.userService.removePermissionFromUser(uid, p, gid);
        if (!ok) failed.push(p);
      } catch (e) {
        failed.push(p);
      }
    }
    if (failed.length) {
      // revert
      this.permissionsEditor.selected = prev.slice();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron quitar algunos permisos: ' + failed.join(', ') });
    } else {
      this.messageService.add({ severity: 'success', summary: 'Permisos', detail: 'Permisos de ticket removidos correctamente' });
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.groupForm.valid) return;
    const formValue = this.groupForm.value;
    try {
      if (this.editingGroup) {
        await this.groupService.updateGroup(this.editingGroup.id, formValue);
        this.editingGroup = null;
        this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Grupo actualizado' });
      } else {
        const created = await this.groupService.createGroup(formValue);
        this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Grupo creado correctamente' });
        // navigate to the new group's dashboard (GroupService already updates groups)
        await this.router.navigate(['/group', encodeURIComponent(created.id)]);
        // persist selected ticket permissions for the owner (if any)
        try {
          const current = this.userService.getCurrentUser();
          const ownerId = formValue.ownerUserId || (current ? String(current.id) : null);
          if (ownerId && Array.isArray(this.newGroupPermissions) && this.newGroupPermissions.length) {
            for (const p of this.newGroupPermissions) {
              try {
                await this.groupService.addPermissionToUserInGroup(ownerId, created.id, p);
              } catch (e) {
                // ignore individual failures, log optionally
                console.warn('[GroupsManagement] Failed to persist permission', p, e);
              }
            }
          }
        } catch (e) {
          console.warn('[GroupsManagement] Error persisting initial group permissions', e);
        }
      }
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: (e as any)?.message || 'Error al crear grupo' });
    } finally {
      this.groupForm.reset({ level: 'Básico', ownerUserId: '' });
    }
  }

  editGroup(group: Group): void {
    this.editingGroup = group;
    this.groupForm.patchValue({
      name: group.name,
      description: group.description,
      level: group.level || 'Básico',
      ownerUserId: (group as any).ownerUserId || ''
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async deleteGroup(id: string): Promise<void> {
    const group = this.groups.find(g => g.id === id);
    const currentUser = this.groupService ? (this.groupService as any).userService.getCurrentUser() : null;
    if (!group) return;
    // If current user is the owner, allow transfer instead of deletion
    if (currentUser && group && (group as any).ownerUserId && String((group as any).ownerUserId) === String(currentUser.id)) {
      const transfer = window.prompt('Eres el líder de este grupo. Ingresa el ID del nuevo líder para transferir la propiedad y conservar el grupo, o deja vacío para eliminar el grupo completamente.');
      if (transfer && transfer.trim()) {
        try {
          const res = await this.groupService.transferOwner(group.id, transfer.trim());
          if (res) {
            this.messageService.add({ severity: 'success', summary: 'Transferido', detail: 'Propiedad transferida correctamente' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo transferir la propiedad' });
          }
        } catch (e) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: (e as any)?.message || 'Error al transferir propietario' });
        }
        return;
      }
      // otherwise proceed to deletion flow
    }

    if (!confirm('¿Estás seguro de que deseas eliminar este grupo?')) return;
    try {
      await this.groupService.deleteGroup(id);
      this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Grupo eliminado correctamente' });
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: (e as any)?.message || 'Error al eliminar grupo' });
    }
  }

  cancelEdit(): void {
    this.editingGroup = null;
    this.groupForm.reset({ level: 'Básico' });
  }
}
