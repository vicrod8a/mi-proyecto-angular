import { Injectable, computed, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  // internal signals
  private _permissions = signal<string[]>([]);
  private _availablePermissions = signal<string[]>([]);

  // Stores a pending permission set while available permissions are still being loaded.
  private pendingPermissions: string[] | null = null;

  // readonly accessors that components/directives can rely on
  public readonly permissions: Signal<string[]> = this._permissions;
  public readonly availablePermissions: Signal<string[]> = this._availablePermissions;

  constructor(private http: HttpClient) {}

  /**
   * Load permissions from a local JSON file (simulating API call)
   * The caller can subscribe to the observable or await the promise.
   */
  loadPermissions(): Observable<any> {
    console.log('[PermissionService] loading permissions from assets');
    // use relative path without leading slash to avoid base-href issues
    return this.http.get('assets/permissions.json');
  }

  /**
   * Helper to fetch and apply available permissions from JSON immediately.
   * This loads the set of valid permissions from the JSON file.
   */
  reloadAvailablePermissions(): void {
    this.loadPermissions().subscribe((data: any) => {
      const perms: string[] = [];
      Object.values(data).forEach((arr: any) => {
        if (Array.isArray(arr)) {
          perms.push(...arr);
        }
      });
      console.log('[PermissionService] Available permissions from JSON:', perms);
      this._availablePermissions.set(perms);

      // Re-apply current permissions now that the available list is updated.
      // This ensures permission changes in the JSON (add/remove) take effect immediately.
      const current = this._permissions();
      if (current.length) {
        this.setPermissions(current);
      }

      // If permissions were set while the available permissions were not yet loaded,
      // apply them now that the available list is ready.
      if (this.pendingPermissions) {
        this.setPermissions(this.pendingPermissions);
        this.pendingPermissions = null;
      }
    });
  }

  /**
   * Replace the current set of permissions with a new list.
   * Only includes permissions that are available in the JSON.
   */
  setPermissions(perms: string[]) {
    // Store pending permissions if the available list isn't loaded yet.
    const available = this._availablePermissions();
    if (!available || available.length === 0) {
      console.warn('[PermissionService] Available permissions not loaded yet, queuing permissions update');
      this.pendingPermissions = perms;
      return;
    }

    // Filter user permissions to only those that are available in the JSON
    const filtered = perms.filter(p => available.includes(p));
    console.log('[PermissionService] Setting permissions. Input:', perms, 'Filtered:', filtered);
    this._permissions.set(filtered);
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

  /**
   * Returns a reactive signal that updates when permissions change.
   * Useful when used directly in templates (avoids relying on method call tracking).
   */
  hasPermissionSignal(permission: string): Signal<boolean> {
    return computed(() => this.hasPermission(permission));
  }
}
