import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ChartModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  groups: string[] = ['Equipo Dev', 'Soporte', 'UX'];

  // basic chart data
  smallChartData: any;
  smallChartOptions: any;

  constructor(private router: Router) {
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

  openGroup(group: string) {
    // navegar al dashboard del grupo
    this.router.navigate(['/group', encodeURIComponent(group)]);
  }
}