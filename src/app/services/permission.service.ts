import { Injectable, computed, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getAuthToken } from './token.storage';
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
    // Accept perms as strings or objects ({ name, nombre, permission, id })
    const asStrings = (perms || []).map((p: any) => {
      if (!p) return '';
      if (typeof p === 'string') return p;
      return p.nombre || p.name || p.permission || p.id || '';
    }).filter(Boolean) as string[];

    // Normalize incoming permission names (server may return different separators or synonyms)
    const normalize = (p: string) => {
      if (!p) return p;
      let s = String(p).replace(/:/g, '.');
      // common synonym mappings
      const synonyms: Record<string, string> = {
        'ticket.edit': 'ticket.update',
        'ticket.view': 'ticket.read',
        'user.manage': 'permission.manage'
      };
      if (synonyms[s]) s = synonyms[s];
      return s;
    };

    const normalized = asStrings.map(normalize).filter(Boolean);
    // Filter user permissions to only those that are available in the JSON
    const filtered = normalized.filter(p => available.includes(p));
    console.log('[PermissionService] Setting permissions. Input:', perms, 'AsStrings:', asStrings, 'Normalized:', normalized, 'Filtered:', filtered);
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

  /**
   * Refresh permissions scoped to a specific group.
   * Fetches permissions from the backend and applies global + group-scoped
   * permissions that match the provided `groupId`.
   */
  async refreshPermissionsForGroup(groupId: string): Promise<void> {
    try {
      const token = getAuthToken() || localStorage.getItem('supabase.auth.token');
      if (!token) return;
      const API_BASE = 'http://127.0.0.1:3000';
      // Prefer group-scoped endpoint if available
      try {
        const grpRes = await fetch(`${API_BASE}/groups/${encodeURIComponent(groupId)}/permissions`, { headers: { Authorization: `Bearer ${token}` } });
        if (grpRes.ok) {
          const grpBody = await grpRes.json().catch(() => null);
          const arr = Array.isArray(grpBody) ? grpBody : (grpBody?.data || grpBody || []);
          // Attempt to find permissions for current user stored in localStorage
          const currentUserRaw = localStorage.getItem('mi-proyecto-current-user-obj');
          let currentUserId: string | null = null;
          try { currentUserId = currentUserRaw ? JSON.parse(currentUserRaw).id : null; } catch (e) { currentUserId = null; }
          let permissions: string[] = [];
          if (currentUserId) {
            const entry = (arr || []).find((e: any) => String(e.user_id || e.userId || e.user_id) === String(currentUserId));
            if (entry) {
              if (Array.isArray(entry.permissions)) permissions = entry.permissions.slice();
              else if (Array.isArray(entry.permisos)) permissions = entry.permisos.slice();
            }
          }
          // If no per-user entry, the group endpoint may return aggregated rows; map any permission-like objects
          if (!permissions.length) {
            permissions = (arr || []).flatMap((e: any) => Array.isArray(e.permissions) ? e.permissions : (e.nombre ? [e.nombre] : []));
          }
          const filtered = (permissions || []).map((p: any) => p && (p.nombre || p.name || p.permission || p) ).filter(Boolean) as string[];
          if (filtered.length) {
            this.setPermissions(filtered);
            return;
          }
        }
      } catch (e) {
        // ignore and fallback to users/permissions
      }

      // Fallback: query /users/permissions and filter by grupo_id (legacy)
      const res = await fetch(`${API_BASE}/users/permissions`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const body = await res.json().catch(() => null);
      const permsArr = Array.isArray(body) ? body : (body?.data || body || []);
      const filtered = (permsArr || [])
        .filter((p: any) => p && (p.grupo_id === null || p.grupo_id === undefined || String(p.grupo_id) === String(groupId) || String(p.group_id) === String(groupId)))
        .map((p: any) => p.nombre || p.name || p.permission || p.id)
        .filter(Boolean) as string[];
      if (filtered.length) this.setPermissions(filtered);
    } catch (e) {
      console.warn('[PermissionService] refreshPermissionsForGroup failed', e);
    }
  }
}
