import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SidebarService } from '../../services/sidebar.service';
import { GroupService, Group } from '../../services/group.service';
import { IfHasPermissionDirective } from '../../directives/if-has-permission.directive'; 
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    InputTextModule,
    FormsModule,
    TableModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    IfHasPermissionDirective
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css'
})
export class GroupComponent implements OnInit {
  groups: Group[] = [];
  showDialog = false;
  isEditing = false;
  groupForm: FormGroup;
  selectedGroup: Group | null = null;


  constructor(
    public sidebarService: SidebarService,
    private groupService: GroupService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private permissionService: PermissionService
  ) {
    this.groupForm = this.fb.group({
      nivel: ['', Validators.required],
      autor: ['', Validators.required],
      nombre: ['', Validators.required],
      integrantes: ['', Validators.required],
      tickets: ['', [Validators.required, Validators.min(0)]],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    this.groupService.groups$.subscribe(groups => {
      this.groups = groups;
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  // utility for testing permission behaviour
  revokeGroupAdd() {
    const perms = this.permissionService.permissions();
    const filtered = perms.filter(p => p !== 'groups_add' && p !== 'group_add');
    this.permissionService.setPermissions(filtered);
    this.messageService.add({
      severity: 'info',
      summary: 'Permisos actualizados',
      detail: 'Se han eliminado los permisos de creación de grupos'
    });
  }

  openNewDialog() {
    this.isEditing = false;
    this.selectedGroup = null;
    this.groupForm.reset();
    this.showDialog = true;
  }

  openEditDialog(group: Group) {
    this.isEditing = true;
    this.selectedGroup = group;
    this.groupForm.patchValue({
      nivel: group.nivel,
      autor: group.autor,
      nombre: group.nombre,
      integrantes: group.integrantes,
      tickets: group.tickets,
      descripcion: group.descripcion
    });
    this.showDialog = true;
  }

  saveGroup() {
    if (this.groupForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos inválidos',
        detail: 'Completa todos los campos correctamente'
      });
      return;
    }

    if (this.isEditing && this.selectedGroup) {
      this.groupService.updateGroup(this.selectedGroup.id, this.groupForm.value);
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Grupo actualizado correctamente'
      });
    } else {
      this.groupService.addGroup(this.groupForm.value);
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Grupo creado correctamente'
      });
    }

    this.showDialog = false;
    this.groupForm.reset();
  }

  deleteGroup(group: Group) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este grupo?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.groupService.deleteGroup(group.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Grupo eliminado correctamente'
        });
      }
    });
  }

  closeDialog() {
    this.showDialog = false;
    this.groupForm.reset();
  }
}