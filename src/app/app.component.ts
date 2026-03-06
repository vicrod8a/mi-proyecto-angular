import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PermissionService } from './services/permission.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private permService: PermissionService) {}

  ngOnInit() {
    // load mock permissions JSON and apply
    this.permService.loadPermissions().subscribe((data: any) => {
      // flatten arrays to single list
      const perms: string[] = [];
      Object.values(data).forEach((arr: any) => {
        if (Array.isArray(arr)) {
          perms.push(...arr);
        }
      });
      this.permService.setPermissions(perms);
    });
  }

  // helper callable from console: app.reloadPerms()
  reloadPerms() {
    this.permService.reloadPermissions();
  }
}