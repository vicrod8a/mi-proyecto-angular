import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { GroupService, Group } from '../../services/group.service';
import { PermissionService } from '../../services/permission.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ChartModule, DialogModule, ButtonModule, InputTextModule, ToastModule, FormsModule],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  groups: Group[] = [];
  showJoinGroupDialog = false;
  invitationCode = '';

  // basic chart data
  smallChartData: any;
  smallChartOptions: any;

  constructor(
    private router: Router,
    private groupService: GroupService,
    private permissionService: PermissionService,
    private messageService: MessageService
  ) {
    // generate small chart data on init
    this.smallChartData = {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [{
        label: 'Visitas',
        data: [12, 19, 3, 5, 2, 3, 9],
        borderColor: '#3b82f6',
        fill: false
      }]
    };
    this.smallChartOptions = { maintainAspectRatio: false, scales: { y: { beginAtZero: true } } };
  }

  ngOnInit() {
    this.groups = this.groupService.getMyGroups();
  }

  openGroup(group: Group) {
    // navegar al dashboard del grupo
    this.router.navigate(['/group', encodeURIComponent(group.id)]);
  }

  joinGroup() {
    if (!this.invitationCode.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Código requerido',
        detail: 'Por favor ingresa un código de invitación'
      });
      return;
    }

    const success = this.groupService.joinGroupByCode(this.invitationCode.toUpperCase());
    if (success) {
      this.messageService.add({
        severity: 'success',
        summary: '¡Éxito!',
        detail: 'Te has unido al grupo correctamente'
      });
      this.invitationCode = '';
      this.showJoinGroupDialog = false;
      // Refresh groups list
      this.groups = this.groupService.getMyGroups();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Código inválido',
        detail: 'El código de invitación no es válido o ya has expirado'
      });
    }
  }

  closeJoinGroupDialog() {
    this.showJoinGroupDialog = false;
    this.invitationCode = '';
  }
}