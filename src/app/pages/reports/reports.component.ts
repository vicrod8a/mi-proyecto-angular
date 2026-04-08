import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ActivatedRoute } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { TicketService } from '../../services/ticket.service';
import { GroupService, Group } from '../../services/group.service';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  reportType: string | null = null;
  groupName: string | null = null;
  chartData: any;
  chartOptions: any;
  users: User[] = [];
  tickets: Ticket[] = [];
  groups: Group[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private ticketService: TicketService,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    // react whenever parameters change (switching report type or group)
    this.route.paramMap.subscribe(params => {
      this.reportType = params.get('type');
      this.groupName = params.get('name');
      this.loadData();
    });
  }

  loadData() {
    // Load all data needed for reports; filter by group if provided
    this.userService.getUsers().subscribe(users => {
      this.users = this.filterUsersByGroup(users);
      this.generateData();
    });
    this.ticketService.getTickets().subscribe(tickets => {
      this.tickets = this.filterTicketsByGroup(tickets);
      this.generateData();
    });
    this.groupService.getGroups().subscribe(groups => {
      this.groups = this.filterGroupsByGroup(groups);
      this.generateData();
    });
  }

  generateData() {
    if (!this.users.length || !this.tickets.length || !this.groups.length) return;

    switch (this.reportType) {
      case 'users':
        this.generateUsersReport();
        break;
      case 'tickets':
        this.generateTicketsReport();
        break;
      case 'groups':
        this.generateGroupsReport();
        break;
      default:
        this.chartData = null;
        this.chartOptions = {};
    }
  }

  generateUsersReport() {
    // Distribution by role
    const roleCounts = this.users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);


    this.chartData = {
      labels: Object.keys(roleCounts),
      datasets: [{
        data: Object.values(roleCounts),
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
      }]
    };
    this.chartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        title: {
          display: true,
          text: 'Distribución de Usuarios por Rol'
        }
      }
    };
  }

  generateTicketsReport() {
    // Distribution by status
    const statusCounts = this.tickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.chartData = {
      labels: Object.keys(statusCounts),
      datasets: [{
        label: 'Tickets',
        data: Object.values(statusCounts),
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
      }]
    };
    this.chartOptions = {
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Distribución de Tickets por Estado'
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    };
  }

  generateGroupsReport() {
    // Members per group
    this.chartData = {
      labels: this.groups.map(g => g.name),
      datasets: [{
        label: 'Miembros',
        data: this.groups.map(g => g.memberCount),
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
      }]
    };
    this.chartOptions = {
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Miembros por Grupo'
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    };
  }

  getChartType(): 'pie' | 'bar' | 'line' {
    switch (this.reportType) {
      case 'users': return 'pie';
      case 'tickets': return 'bar';
      case 'groups': return 'bar';
      default: return 'line';
    }
  }

  getSummaryLabel(): string {
    switch (this.reportType) {
      case 'users': return 'Total Usuarios';
      case 'tickets': return 'Total Tickets';
      case 'groups': return 'Total Grupos';
      default: return 'Total';
    }
  }

  getTotalCount(): number {
    switch (this.reportType) {
      case 'users': return this.users.length;
      case 'tickets': return this.tickets.length;
      case 'groups': return this.groups.length;
      default: return 0;
    }
  }

  getMaxValue(): number {
    if (!this.chartData?.datasets?.[0]?.data) return 0;
    return Math.max(...this.chartData.datasets[0].data);
  }

  private filterUsersByGroup(users: User[]): User[] {
    if (!this.groupName) return users;
    return users.filter(u => u.groups && u.groups.includes(this.groupName!));
  }

  private filterTicketsByGroup(tickets: Ticket[]): Ticket[] {
    if (!this.groupName) return tickets;
    return tickets.filter(t => t.groupId === this.groupName);
  }

  private filterGroupsByGroup(groups: Group[]): Group[] {
    if (!this.groupName) return groups;
    return groups.filter(g => g.id === this.groupName);
  }
}
