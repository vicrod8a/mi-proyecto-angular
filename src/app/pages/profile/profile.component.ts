import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarService } from '../../services/sidebar.service';

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  joinDate: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    CardModule,
    ButtonModule,
    InputTextModule,
    FormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  isEditing = false;
  user: UserProfile = {
    id: 1,
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com',
    phone: '+34 666 777 888',
    bio: 'Desarrollador Full Stack apasionado por la tecnología y la innovación.',
    avatar: 'https://via.placeholder.com/200',
    joinDate: '2024-01-15'
  };

  editingUser: UserProfile = { ...this.user };

  constructor(public sidebarService: SidebarService) {}

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
    this.user = { ...this.editingUser };
    this.isEditing = false;
  }

  cancelEdit() {
    this.editingUser = { ...this.user };
    this.isEditing = false;
  }
}
