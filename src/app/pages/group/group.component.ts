import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    CardModule,
    InputTextModule,
    ButtonModule,
    FormsModule
  ],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css'
})
export class GroupComponent {
  total: number | null = null;

  constructor(public sidebarService: SidebarService) {}

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  updateTotal(value: string) {
    const parsed = parseFloat(value);
    this.total = isNaN(parsed) ? null : parsed;
  }
}