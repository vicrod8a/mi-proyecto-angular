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
      level: ['', Validators.required],
      author: ['', Validators.required],
      name: ['', Validators.required],
      members: ['', Validators.required],
      tickets: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required]
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
      level: group.level,
      author: group.author,
      name: group.name,
      members: group.members,
      tickets: group.tickets,
      description: group.description
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

    // Since groups are now static, just show a message
    if (this.isEditing && this.selectedGroup) {
      this.messageService.add({
        severity: 'info',
        summary: 'Información',
        detail: 'Los grupos son administrados por el sistema. Los cambios no se pueden guardar.'
      });
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Información',
        detail: 'Los grupos son administrados por el sistema. No se pueden crear nuevos grupos.'
      });
    }

    this.showDialog = false;
    this.groupForm.reset();
  }

  deleteGroup(group: Group) {
    this.confirmationService.confirm({
      message: 'Los grupos son administrados por el sistema y no se pueden eliminar.',
      header: 'Información',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Información',
          detail: 'Los grupos son administrados por el sistema.'
        });
      }
    });
  }

  closeDialog() {
    this.showDialog = false;
    this.groupForm.reset();
  }
}