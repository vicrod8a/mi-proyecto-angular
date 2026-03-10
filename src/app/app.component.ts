import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PermissionService } from './services/permission.service';
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

  constructor(private permService: PermissionService, private router: Router) {}

  ngOnInit() {
    // Check initial route
    this.updateSidebarVisibility();

    // Subscribe to route changes
    this.router.events.subscribe(() => {
      this.updateSidebarVisibility();
    });

    // load mock permissions JSON and apply
    this.permService.loadPermissions().subscribe({
      next: (data: any) => {
        console.log('[AppComponent] permissions data', data);
        // flatten arrays to single list
        const perms: string[] = [];
        Object.values(data).forEach((arr: any) => {
          if (Array.isArray(arr)) {
            perms.push(...arr);
          }
        });
        this.permService.setPermissions(perms);
        console.log('[AppComponent] applied perms', perms);
      },
      error: err => {
        console.error('Failed to load permissions', err);
      }
    });
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
    this.permService.reloadPermissions();
  }
}