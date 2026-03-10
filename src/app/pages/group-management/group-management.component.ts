import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PermissionService } from '../../services/permission.service';
import { ProfileService, UserProfile } from '../../services/profile.service';

interface GroupUser {
  id: number;
  name: string;
  email: string;
  role: string;
  joinedDate: string;
}

@Component({
  selector: 'app-group-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.css']
})
export class GroupManagementComponent implements OnInit {
  groupName: string = '';
  groupUsers: GroupUser[] = [];
  canManageGroup: boolean = false;
  editMode: boolean = false;
  groupForm: FormGroup;
  addUserForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private profileService: ProfileService
  ) {
    this.groupForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.addUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.groupName = decodeURIComponent(this.route.snapshot.paramMap.get('name') || '');
    this.groupForm.patchValue({ name: this.groupName });

    // Check permissions
    this.canManageGroup = this.permissionService.hasPermission('group:add') ||
                         this.permissionService.hasPermission('group:edit') ||
                         this.permissionService.hasPermission('group:delete');

    if (!this.canManageGroup) {
      this.router.navigate(['/group', encodeURIComponent(this.groupName)]);
      return;
    }

    this.loadGroupUsers();
  }

  loadGroupUsers(): void {
    // Mock data - in real app, this would come from API
    this.groupUsers = [
      {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        role: 'Admin',
        joinedDate: '2024-01-15'
      },
      {
        id: 2,
        name: 'María García',
        email: 'maria.garcia@example.com',
        role: 'Member',
        joinedDate: '2024-02-01'
      },
      {
        id: 3,
        name: 'Pedro López',
        email: 'pedro.lopez@example.com',
        role: 'Member',
        joinedDate: '2024-02-15'
      }
    ];
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.groupForm.patchValue({ name: this.groupName });
    }
  }

  saveGroupSettings(): void {
    if (this.groupForm.valid) {
      const newName = this.groupForm.value.name;
      // In real app, update group name via API
      this.groupName = newName;
      this.editMode = false;
      // Navigate to new route if name changed
      if (newName !== this.groupName) {
        this.router.navigate(['/group', encodeURIComponent(newName), 'manage']);
      }
    }
  }

  addUser(): void {
    if (this.addUserForm.valid) {
      const email = this.addUserForm.value.email;
      // In real app, add user via API
      const newUser: GroupUser = {
        id: Date.now(),
        name: 'Nuevo Usuario',
        email: email,
        role: 'Member',
        joinedDate: new Date().toISOString().split('T')[0]
      };
      this.groupUsers.push(newUser);
      this.addUserForm.reset();
    }
  }

  removeUser(userId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario del grupo?')) {
      this.groupUsers = this.groupUsers.filter(user => user.id !== userId);
    }
  }

  goBack(): void {
    this.router.navigate(['/group', encodeURIComponent(this.groupName)]);
  }
}