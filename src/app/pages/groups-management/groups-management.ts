import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GroupService, Group } from '../../services/group.service';
import { IfHasPermissionDirective } from '../../directives/if-has-permission.directive';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groups-management',
  imports: [CommonModule, ReactiveFormsModule, IfHasPermissionDirective, ToastModule],
  providers: [MessageService],
  templateUrl: './groups-management.html',
  styleUrl: './groups-management.css',
})
export class GroupsManagement implements OnInit {
  groups: Group[] = [];
  groupForm: FormGroup;
  editingGroup: Group | null = null;

  constructor(
    private groupService: GroupService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router
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
