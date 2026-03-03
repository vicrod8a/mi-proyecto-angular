import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SidebarService } from '../../services/sidebar.service';
import { GroupService, Group } from '../../services/group.service';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    CardModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    FormsModule,
    TableModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    DropdownModule
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
    private confirmationService: ConfirmationService
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