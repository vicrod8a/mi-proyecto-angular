import { Injectable, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  // internal signal holding current permission set
  private _permissions = signal<string[]>([]);

  // readonly accessor that components/directives can rely on
  public readonly permissions: Signal<string[]> = this._permissions;

  constructor(private http: HttpClient) {}

  /**
   * Load permissions from a local JSON file (simulating API call)
   * The caller can subscribe to the observable or await the promise.
   */
  loadPermissions(): Observable<any> {
    console.log('[PermissionService] loading permissions from assets');
    return this.http.get('/assets/permissions.json');
  }

  /**
   * Helper to fetch and apply permissions from JSON immediately.
   */
  reloadPermissions(): void {
    this.loadPermissions().subscribe((data: any) => {
      const perms: string[] = [];
      Object.values(data).forEach((arr: any) => {
        if (Array.isArray(arr)) {
          perms.push(...arr);
        }
      });
      this.setPermissions(perms);
    });
  }

  /**
   * Replace the current set of permissions with a new list.
   */
  setPermissions(perms: string[]) {
    this._permissions.set(perms);
  }

  /**
   * Check whether a single permission exists in the current set.
   */
  hasPermission(permission: string): boolean {
    return this._permissions().includes(permission);
  }

  /**
   * Return true if the user has at least one of the supplied permissions.
   */
  hasAnyPermission(perms: string[]): boolean {
    return perms.some(p => this.hasPermission(p));
  }
}
