import { Injectable, signal, ComputedSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  // internal signal holding current permission set
  private _permissions = signal<string[]>([]);

  // readonly accessor that components/directives can rely on
  public readonly permissions: ComputedSignal<string[]> = this._permissions;

  constructor(private http: HttpClient) {}

  /**
   * Load permissions from a local JSON file (simulating API call)
   * The caller can subscribe to the observable or await the promise.
   */
  loadPermissions(): Observable<any> {
    return this.http.get('/assets/permissions.json');
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
