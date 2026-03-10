import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  reportType: string | null = null;
  chartData: any;
  chartOptions: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.reportType = this.route.snapshot.paramMap.get('type');
    this.generateData();
  }

  generateData() {
    switch (this.reportType) {
      case 'users':
        this.chartData = {
          labels: ['Ene','Feb','Mar','Abr','May','Jun'],
          datasets: [{
            label: 'Usuarios nuevos',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: '#3b82f6',
            fill: false
          }]
        };
        this.chartOptions = { maintainAspectRatio: false, scales: { y: { beginAtZero: true } } };
        break;
      case 'tickets':
        this.chartData = {
          labels: ['Q1','Q2','Q3','Q4'],
          datasets: [{
            label: 'Tickets resueltos',
            data: [200, 150, 180, 220],
            backgroundColor: '#10b981'
          }]
        };
        this.chartOptions = { maintainAspectRatio: false };
        break;
      case 'groups':
        this.chartData = {
          labels: ['Dev','Soporte','UX','QA'],
          datasets: [{
            data: [25, 15, 30, 10],
            backgroundColor: ['#fbbf24','#3b82f6','#10b981','#8b5cf6']
          }]
        };
        this.chartOptions = { maintainAspectRatio: false };
        break;
      default:
        this.chartData = null;
        this.chartOptions = {};
    }
  }
}
