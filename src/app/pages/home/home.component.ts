import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class HomeComponent implements OnInit, OnDestroy {
  groups: Group[] = [];
  showJoinGroupDialog = false;
  invitationCode = '';

  // basic chart data
  smallChartData: any;
  smallChartOptions: any;

  private groupsSub: any;

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
    // Subscribe to groups observable so UI updates when groups or membership change
    this.groupsSub = this.groupService.getGroups().subscribe(groups => {
      this.groups = groups.filter(g => g.isMember);
    });
  }

  ngOnDestroy(): void {
    try { this.groupsSub?.unsubscribe(); } catch (e) {}
  }

  openGroup(group: Group) {
    // navegar al dashboard del grupo
    this.router.navigate(['/group', encodeURIComponent(group.id)]);
  }

  async joinGroup() {
    if (!this.invitationCode.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Código requerido',
        detail: 'Por favor ingresa un código de invitación'
      });
      return;
    }

    const success = await this.groupService.joinGroupByCode(this.invitationCode);
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