import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type QuickFilter = 'all' | 'my-tickets' | 'unassigned' | 'high-priority';

@Component({
  selector: 'app-quick-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quick-filters.component.html',
  styleUrls: ['./quick-filters.component.css']
})
export class QuickFiltersComponent {
  @Output() filterChanged = new EventEmitter<QuickFilter>();

  activeFilter: QuickFilter = 'all';

  setFilter(filter: QuickFilter): void {
    this.activeFilter = filter;
    this.filterChanged.emit(filter);
  }
}