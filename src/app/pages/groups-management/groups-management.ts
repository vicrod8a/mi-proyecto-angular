import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GroupService, Group } from '../../services/group.service';
import { IfHasPermissionDirective } from '../../directives/if-has-permission.directive';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

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
    private messageService: MessageService
  ) {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      level: ['Básico', Validators.required]
    });
  }

  ngOnInit(): void {
    this.groupService.getGroups().subscribe(groups => {
      this.groups = groups;
    });
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      const formValue = this.groupForm.value;
      if (this.editingGroup) {
        this.groupService.updateGroup(this.editingGroup.id, formValue);
        this.editingGroup = null;
      } else {
        this.groupService.createGroup(formValue);
      }
      this.groupForm.reset({ level: 'Básico' });
    }
  }

  editGroup(group: Group): void {
    this.editingGroup = group;
    this.groupForm.patchValue({
      name: group.name,
      description: group.description,
      level: group.level || 'Básico'
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteGroup(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este grupo?')) {
      this.groupService.deleteGroup(id);
      this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Grupo eliminado correctamente' });
    }
  }

  cancelEdit(): void {
    this.editingGroup = null;
    this.groupForm.reset({ level: 'Básico' });
  }
}
