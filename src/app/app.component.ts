import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PermissionService } from './services/permission.service';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  showSidebar: boolean = true;
  avatarDropdownOpen: boolean = false;

  constructor(private permService: PermissionService, private userService: UserService, private router: Router) {}

  ngOnInit() {
    // Check initial route
    this.updateSidebarVisibility();

    // Subscribe to route changes
    this.router.events.subscribe(() => {
      this.updateSidebarVisibility();
    });

    // First, load available permissions from JSON
    console.log('[AppComponent] Loading available permissions from JSON...');
    this.permService.reloadAvailablePermissions();

    // Then, set permissions based on current user (deterministic)
    (async () => {
      let currentUser = this.userService.getCurrentUser();

      // If no user is logged in, set the super admin as default
      if (!currentUser) {
        console.log('[AppComponent] No current user found, setting default user...');
        await this.userService.setCurrentUser('1');
        currentUser = this.userService.getCurrentUser();
      } else {
        // Ensure latest permissions are fetched for existing user
        await this.userService.setCurrentUser(currentUser.id);
        currentUser = this.userService.getCurrentUser();
      }

      if (currentUser) {
        this.permService.setPermissions(currentUser.permissions);
        console.log('[AppComponent] applied user perms', currentUser.permissions);
      } else {
        console.warn('[AppComponent] no current user found after default setup');
      }
    })();
  }

  private updateSidebarVisibility() {
    this.showSidebar = !(this.router.url === '/' || this.router.url.includes('/auth'));
  }

  toggleAvatarDropdown() {
    this.avatarDropdownOpen = !this.avatarDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('#avatarDropdown')) {
      this.avatarDropdownOpen = false;
    }
  }

  // helper callable from console: app.reloadPerms()
  reloadPerms() {
    this.permService.reloadAvailablePermissions();
    setTimeout(() => {
      const currentUser = this.userService.getCurrentUser();
      if (currentUser) {
        this.permService.setPermissions(currentUser.permissions);
        console.log('[AppComponent] reloaded perms', currentUser.permissions);
      }
    }, 500);
  }

  // Switch user for demo
  async switchUser(userId: string) {
    await this.userService.setCurrentUser(userId);
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.permService.setPermissions(currentUser.permissions);
      console.log('[AppComponent] switched to user', currentUser.username, 'perms', currentUser.permissions);
    }
  }
}