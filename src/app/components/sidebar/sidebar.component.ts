import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { GroupService, Group } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { IfHasPermissionDirective } from '../../directives/if-has-permission.directive';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IfHasPermissionDirective],
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
  appVersion: string = '0.1.0';

  openGroupMenu: string | null = null; // which group submenu is open

  // report link entries describe the report type; actual URL includes current group
  reportLinks: { type: string; icon: string; label: string }[] = [
    { type: 'users', icon: 'pi pi-users', label: 'Usuarios' },
    { type: 'tickets', icon: 'pi pi-ticket', label: 'Tickets' },
    { type: 'groups', icon: 'pi pi-users', label: 'Grupos' }
  ];

  private subscription: Subscription | undefined;

  constructor(
    private sidebarService: SidebarService,
    private groupService: GroupService,
    private userService: UserService,
    private router: Router
  ) {}

  get currentGroup(): string {
    const parts = this.router.url.split('/');
    const idx = parts.indexOf('group');
    return idx >= 0 && parts.length > idx + 1 ? parts[idx + 1] : 'equipo-dev';
  }
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
    if (!this.sidebarVisible) {
      this.sidebarService.toggleSidebar();
    }
    this.groupsDropdownVisible = !this.groupsDropdownVisible;
    if (!this.groupsDropdownVisible) {
      this.openGroupMenu = null;
    }
  }

  toggleGroupMenu(groupId: string) {
    this.openGroupMenu = this.openGroupMenu === groupId ? null : groupId;
  }

  toggleReportsDropdown() {
    if (!this.sidebarVisible) {
      this.sidebarService.toggleSidebar();
    }
    this.reportsDropdownVisible = !this.reportsDropdownVisible;
  }

  canManageUsers(): boolean {
    const currentUser = this.userService.getCurrentUser();
    return currentUser ? ((currentUser.permissions || []).includes('permission.manage') || (currentUser.permissions || []).includes('system.admin')) : false;
  }

  joinGroup(groupId: string): void {
    this.groupService.joinGroup(groupId);
  }

  leaveGroup(groupId: string): void {
    this.groupService.leaveGroup(groupId);
  }

  saveSidebarState() {
    // El servicio ya guarda automáticamente
  }
}