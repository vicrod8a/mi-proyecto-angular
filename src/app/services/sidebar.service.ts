import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarVisibleSubject = new BehaviorSubject<boolean>(true);
  public sidebarVisible$ = this.sidebarVisibleSubject.asObservable();

  constructor() {
    this.loadSidebarState();
  }

  private loadSidebarState() {
    const saved = localStorage.getItem('sidebarState');
    if (saved !== null) {
      this.sidebarVisibleSubject.next(JSON.parse(saved));
    }
  }

  toggleSidebar() {
    const newState = !this.sidebarVisibleSubject.value;
    this.sidebarVisibleSubject.next(newState);
    this.saveSidebarState();
  }

  setSidebarVisible(visible: boolean) {
    this.sidebarVisibleSubject.next(visible);
    this.saveSidebarState();
  }

  getSidebarVisible(): boolean {
    return this.sidebarVisibleSubject.value;
  }

  private saveSidebarState() {
    localStorage.setItem('sidebarState', JSON.stringify(this.sidebarVisibleSubject.value));
  }
}
