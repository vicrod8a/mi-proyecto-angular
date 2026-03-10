import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { GroupService, Group } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  // no styles needed; Tailwind handles styling globally
})
export class SidebarComponent implements OnInit, OnDestroy {
  // leftover menu entries (config and logout only)
  public menu: { link: string; icon: string; label: string }[] = [
    { link: '/settings', icon: 'pi pi-cog', label: 'Configuración' }
  ];
  sidebarVisible: boolean = true;
  groups: Group[] = [];
  groupsDropdownVisible: boolean = false;
  reportsDropdownVisible: boolean = false;
  reportLinks: { link: string; icon: string; label: string }[] = [
    { link: '/reports/users', icon: 'pi pi-users', label: 'Usuarios' },
    { link: '/reports/tickets', icon: 'pi pi-ticket', label: 'Tickets' },
    { link: '/reports/groups', icon: 'pi pi-users', label: 'Grupos' }
  ];
  private subscription: Subscription | undefined;

  constructor(
    private sidebarService: SidebarService,
    private groupService: GroupService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.subscription = this.sidebarService.sidebarVisible$.subscribe(visible => {
      this.sidebarVisible = visible;
    });

    // Cargar todos los grupos disponibles
    this.groupService.getGroups().subscribe(groups => {
      this.groups = groups;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  toggleGroupsDropdown() {
    this.groupsDropdownVisible = !this.groupsDropdownVisible;
  }

  toggleReportsDropdown() {
    this.reportsDropdownVisible = !this.reportsDropdownVisible;
  }

  canManageUsers(): boolean {
    const currentUser = this.userService.getCurrentUser();
    return currentUser ? this.userService.isSuperAdmin(currentUser.id) : false;
  }

  saveSidebarState() {
    // El servicio ya guarda automáticamente
  }
}