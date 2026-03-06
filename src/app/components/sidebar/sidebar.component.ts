import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  // no styles needed; Tailwind handles styling globally
})
export class SidebarComponent implements OnInit, OnDestroy {
  public menu: { link: string; icon: string; label: string }[] = [
    { link: '/home', icon: 'pi pi-home', label: 'Inicio' },
    { link: '/profile', icon: 'pi pi-user', label: 'Perfil' },
    { link: '/settings', icon: 'pi pi-cog', label: 'Configuración' },
    { link: '/group', icon: 'pi pi-users', label: 'Group' },
    { link: '/reports', icon: 'pi pi-chart-bar', label: 'Reportes' },
    { link: '/auth/login', icon: 'pi pi-sign-out', label: 'Cerrar Sesión' }
  ];
  sidebarVisible: boolean = true;
  private subscription: Subscription | undefined;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.subscription = this.sidebarService.sidebarVisible$.subscribe(visible => {
      this.sidebarVisible = visible;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  saveSidebarState() {
    // El servicio ya guarda automáticamente
  }
}