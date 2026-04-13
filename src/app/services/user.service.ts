import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import UserApiClient from './user.api.client';
import { PermissionService } from './permission.service';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  createdDate: string;
  lastLogin?: string;
  groups: string[];
  password: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  avatar?: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly STORAGE_KEY = 'mi-proyecto-users';
  private readonly CURRENT_USER_KEY = 'mi-proyecto-current-user';
  private readonly CURRENT_USER_OBJ_KEY = 'mi-proyecto-current-user-obj';
  private readonly TOKEN_KEY = 'mi-proyecto-token';
  private api = new UserApiClient();
  private usersSubject = new BehaviorSubject<User[]>(this.loadInitialUsers());
  public users$ = this.usersSubject.asObservable();

  private permissionsSubject = new BehaviorSubject<Permission[]>(this.getAllPermissions());
  public permissions$ = this.permissionsSubject.asObservable();

  private currentUserId: string = this.loadCurrentUserIdFromStorage() || '1';

  constructor(private permissionService?: PermissionService) {}

  private loadUsersFromStorage(): User[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const users = JSON.parse(stored);
        console.log('[UserService] Loaded users from localStorage:', users);
        return users;
      } catch (e) {
        console.warn('[UserService] Error parsing stored users:', e);
      }
    }
    // No default mock users in production; return empty list when no storage present
    return [];
  }

  private loadCurrentUserIdFromStorage(): string | null {
    const stored = localStorage.getItem(this.CURRENT_USER_KEY);
    return stored || null;
  }

  private loadCurrentUserObjectFromStorage(): User | null {
    try {
      const raw = localStorage.getItem(this.CURRENT_USER_OBJ_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch (e) {
      return null;
    }
  }

  private saveCurrentUserObjectToStorage(user: User | null): void {
    try {
      if (!user) {
        localStorage.removeItem(this.CURRENT_USER_OBJ_KEY);
        return;
      }
      localStorage.setItem(this.CURRENT_USER_OBJ_KEY, JSON.stringify(user));
    } catch (e) {
      // ignore
    }
  }

  private loadInitialUsers(): User[] {
    const current = this.loadCurrentUserObjectFromStorage();
    return current ? [current] : [];
  }

  private saveUsersToStorage(users: User[]): void {
    // Intentionally do not persist users to localStorage anymore.
    // Persistence should happen server-side via API calls and `syncUsers()`.
    // Keep this method for compatibility but make it a no-op to avoid accidental local writes.
    return;
  }

  private saveCurrentUserIdToStorage(userId: string): void {
    try {
      localStorage.setItem(this.CURRENT_USER_KEY, userId);
      console.log('[UserService] Saved current user ID to localStorage:', userId);
    } catch (e) {
      console.warn('[UserService] Error saving current user ID to localStorage:', e);
    }
  }

  // Default/mock users removed — real users come from backend via syncUsers()

  private getAllPermissions(): Permission[] {
    return [
      { id: 'ticket.create', name: 'Crear Tickets', description: 'Permite crear nuevos tickets', category: 'Tickets' },
      { id: 'ticket.read', name: 'Ver Tickets', description: 'Permite ver tickets existentes', category: 'Tickets' },
      { id: 'ticket.update', name: 'Editar Tickets', description: 'Permite editar tickets existentes', category: 'Tickets' },
      { id: 'ticket.delete', name: 'Eliminar Tickets', description: 'Permite eliminar tickets', category: 'Tickets' },
      { id: 'group.create', name: 'Crear Grupos', description: 'Permite crear nuevos grupos', category: 'Grupos' },
      { id: 'group.read', name: 'Ver Grupos', description: 'Permite ver grupos existentes', category: 'Grupos' },
      { id: 'group.update', name: 'Editar Grupos', description: 'Permite editar grupos existentes', category: 'Grupos' },
      { id: 'group.delete', name: 'Eliminar Grupos', description: 'Permite eliminar grupos', category: 'Grupos' },
      { id: 'group.manage', name: 'Gestionar Grupos', description: 'Permite acceder al panel de gestión de grupos', category: 'Grupos' },
      { id: 'user.create', name: 'Crear Usuarios', description: 'Permite crear nuevos usuarios', category: 'Usuarios' },
      { id: 'user.read', name: 'Ver Usuarios', description: 'Permite ver usuarios existentes', category: 'Usuarios' },
      { id: 'user.update', name: 'Editar Usuarios', description: 'Permite editar usuarios existentes', category: 'Usuarios' },
      { id: 'user.delete', name: 'Eliminar Usuarios', description: 'Permite eliminar usuarios', category: 'Usuarios' },
      { id: 'permission.manage', name: 'Gestionar Permisos', description: 'Permite asignar y quitar permisos a usuarios', category: 'Permisos' },
      { id: 'system.admin', name: 'Administrador del Sistema', description: 'Acceso completo al sistema', category: 'Sistema' },
      { id: 'report.read', name: 'Ver Reportes', description: 'Permite acceder a reportes del sistema', category: 'Reportes' },
    ];
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  getPermissions(): Observable<Permission[]> {
    return this.permissions$;
  }

  getUserById(id: string): User | null {
    return this.usersSubject.value.find((user) => user.id === id) || null;
  }

  getCurrentUser(): User | null {
    return this.getUserById(this.currentUserId) || null;
  }

  async login(email: string, password: string): Promise<any> {
    console.log('Intentando login con user-service y Supabase fallback:', { email });
    try {
      const resp = await this.api.login(email, password);
      const envelope = resp && resp.data ? resp.data : resp;
      const token = envelope?.token;
      const userPayload = envelope?.usuario || envelope?.user || envelope;
      if (token) {
        try {
          localStorage.setItem(this.TOKEN_KEY, token);
        } catch {}
      }

      let perms: string[] = userPayload.permissions || [];
      try {
        if (userPayload && userPayload.id) {
          const userId = String(userPayload.id);
          await this.setCurrentUser(userId);
          const others = this.usersSubject.value.filter((u) => u.id !== userId);
          try {
            const permResp = await this.api.getPermissions(token);
            const permEnvelope = permResp && permResp.data ? permResp.data : permResp;
            if (Array.isArray(permEnvelope)) {
              perms = (permEnvelope as any[])
                .map((p) => {
                  if (!p) return '';
                  if (typeof p === 'string') return p;
                  return p.nombre || p.name || p.permission || p.id || '';
                })
                .filter(Boolean);
            }
          } catch (e) {
            // ignore permission fetch errors; fall back to payload
          }

          const normalized: User = {
            id: userId,
            username: userPayload.name || userPayload.username || userPayload.email || '',
            email: userPayload.email || '',
            firstName: userPayload.firstName || userPayload.nombre_completo || '',
            lastName: userPayload.lastName || '',
            role: userPayload.role || userPayload.rol || '',
            permissions: perms || (userPayload.permissions || []),
            isActive: true,
            createdDate: new Date().toISOString().split('T')[0],
            lastLogin: undefined,
            groups: userPayload.groupIds || [],
            password: '',
            phone: userPayload.phone || undefined,
            address: userPayload.address || undefined,
            birthDate: userPayload.birthdate || undefined,
            avatar: userPayload.avatar || undefined,
          };

            const updated = [...others, normalized];
            this.saveUsersToStorage(updated);
            this.usersSubject.next(updated);
            // Persist a copy of the current user object so UI can survive backend failures
            this.saveCurrentUserObjectToStorage(normalized);
          try {
            const permsToSet = perms || (userPayload.permissions || []);
            if (this.permissionService) {
              this.permissionService.setPermissions(permsToSet);
            }
          } catch (e) {
            // non-fatal
          }

          try {
            await this.syncUsers();
          } catch (e) {
            /* ignore sync errors */
          }

          return { success: true, user: normalized, token };
        }
      } catch (e: any) {
        console.warn('[UserService] API login failed, falling back to Supabase', e?.message || e);
      }

      return { success: false, message: 'Login falló: autenticación por API no disponible' };
    } catch (e: any) {
      console.warn('[UserService] API login failed', e?.message || e);
      return { success: false, message: e?.message || String(e) };
    }
  }

  async register(payload: { username: string; email: string; password: string; fullName?: string; address?: string; phone?: string; birthdate?: string; }) {
    try {
      const full = payload.fullName || '';
      const [firstName, ...rest] = full.trim().split(/\s+/);
      const lastName = rest.join(' ');
      const resp = await this.api.register({
        username: payload.username,
        email: payload.email,
        password: payload.password,
        first_name: firstName || '',
        last_name: lastName || '',
      });
      const envelope = resp && resp.data ? resp.data : resp;
      if (envelope && (envelope.id || envelope.message)) {
        return { success: true, data: envelope };
      }
      return { success: false, message: 'Registro fallido' };
    } catch (e: any) {
      return { success: false, message: e?.message || String(e) };
    }
  }

  logout(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch {}
    this.currentUserId = '';
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  async syncUsers(): Promise<void> {
    const token = localStorage.getItem(this.TOKEN_KEY) || undefined;
    try {
      const resp = await this.api.getUsers(token);
      const envelope = resp && resp.data ? resp.data : resp;
      const usersData = Array.isArray(envelope) ? envelope : envelope?.data || [];
      const normalized = (usersData || []).map((u: any): User => ({
        id: String(u.id),
        username: u.name || u.username || u.email || '',
        email: u.email || '',
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        role: u.role || u.rol || '',
        permissions: u.permissions || [],
        isActive: true,
        createdDate: new Date().toISOString().split('T')[0],
        lastLogin: undefined,
        groups: u.groupIds || [],
        password: '',
        phone: u.phone || undefined,
        address: u.address || undefined,
        birthDate: u.birthdate || undefined,
        avatar: u.avatar || undefined,
      }));
      this.saveUsersToStorage(normalized);
      this.usersSubject.next(normalized);
      // If we have a current user stored, update the stored object to the canonical one
      try {
        const curId = this.loadCurrentUserIdFromStorage();
        if (curId) {
          const found = normalized.find((u: any) => String(u.id) === String(curId));
          if (found) this.saveCurrentUserObjectToStorage(found as User);
        }
      } catch (e) {}
    } catch (e) {
      console.warn('[UserService] syncUsers failed', e);
    }
  }

  /**
   * Set permissions for a user on the backend and update local store.
   */
  async setPermissionsForUser(userId: string, permissions: string[]): Promise<boolean> {
    const token = localStorage.getItem(this.TOKEN_KEY) || undefined;
    try {
      if (!token) throw new Error('No token');
      await this.api.setPermissions(userId, permissions, token);
      // After successful backend update, update local user optimistically.
      // Avoid forcing a full sync here to prevent losing session if the backend is unstable.
      try {
        const users = this.usersSubject.value.map(u => u.id === userId ? { ...u, permissions: [...permissions] } : u);
        this.usersSubject.next(users);
        // Only overwrite the persisted current-user object if we're updating the current user
        if (String(userId) === String(this.currentUserId)) {
          this.saveCurrentUserObjectToStorage(users.find(u => u.id === userId) || null);
        }
      } catch (e) {
        console.warn('[UserService] local update after setPermissions failed', e);
      }
      return true;
    } catch (e) {
      console.warn('[UserService] setPermissionsForUser failed', e);
      return false;
    }
  }

  async setCurrentUser(userId: string): Promise<void> {
    this.currentUserId = userId;
    this.saveCurrentUserIdToStorage(userId);
    try {
      const token = localStorage.getItem(this.TOKEN_KEY) || undefined;
      console.log('[UserService] token present?', !!token);
      if (!token) return;
      const permResp = await this.api.getPermissionsFor(userId, token);
      console.log('[UserService] raw permResp:', permResp);
      const permEnvelope = permResp && permResp.data ? permResp.data : permResp;
      let perms: string[] = [];
      if (Array.isArray(permEnvelope)) {
        if (permEnvelope.length && typeof permEnvelope[0] === 'string') {
          perms = permEnvelope as string[];
        } else {
          perms = (permEnvelope as any[]).map((p) => p.nombre || p.name || p.permission || p.id || '').filter(Boolean);
        }
      }
      console.log('[UserService] fetched permissions for user', userId, perms);
      if (this.permissionService) {
        this.permissionService.setPermissions(perms);
      }
      const users = this.usersSubject.value.map((u) => (u.id === userId ? { ...u, permissions: perms } : u));
      this.saveUsersToStorage(users);
      this.usersSubject.next(users);
      // update stored current user object if present
      try {
        const cur = users.find((u) => u.id === userId);
        if (cur) this.saveCurrentUserObjectToStorage(cur);
      } catch (e) {}
    } catch (e: any) {
      console.warn('[UserService] fetching permissions failed', e?.message || e, e?.body || null);
    }
  }

  async createUser(user: Omit<User, 'id' | 'createdDate'>): Promise<boolean> {
    // optimistic local add
    const newUser: User = {
      ...user,
      id: this.generateId(),
      createdDate: new Date().toISOString().split('T')[0],
    };
    const currentUsers = this.usersSubject.value;
    const updated = [...currentUsers, newUser];
    this.saveUsersToStorage(updated);
    this.usersSubject.next(updated);

    // attempt to persist to backend if token present
    const token = localStorage.getItem(this.TOKEN_KEY) || undefined;
    if (!token) return true; // no server persistence possible, treat as success for local-only flow

    try {
      const payload: any = {
        username: user.username,
        email: user.email,
        first_name: (user.firstName || '').split(' ')[0] || undefined,
        last_name: user.lastName || undefined,
        address: user.address,
        phone: user.phone,
        birthdate: user.birthDate,
        role: user.role,
        is_active: user.isActive,
        password: user.password || undefined
      };

      const resp = await this.api.createUser(payload, token);
      const envelope = resp && resp.data ? resp.data : resp;
      if (envelope && envelope.id) {
        // replace optimistic user with server user
        const merged = this.usersSubject.value.map(u => u.id === newUser.id ? {
          ...u,
          id: String(envelope.id),
          username: envelope.username || u.username,
          email: envelope.email || u.email,
          firstName: envelope.first_name || u.firstName,
          lastName: envelope.last_name || u.lastName,
          phone: envelope.phone || u.phone,
          address: envelope.address || u.address,
          birthDate: envelope.birthdate || u.birthDate,
          createdDate: envelope.created_at ? envelope.created_at.split('T')[0] : u.createdDate
        } : u);
        this.saveUsersToStorage(merged);
        this.usersSubject.next(merged);
        return true;
      }
    } catch (e) {
      console.warn('[UserService] createUser persist failed', e);
      return false;
    }
    return true;
  }

  updateUser(id: string, userData: Partial<User>): void {
    const currentUsers = this.usersSubject.value;
    const userIndex = currentUsers.findIndex((user) => user.id === id);
    if (userIndex > -1) {
      currentUsers[userIndex] = { ...currentUsers[userIndex], ...userData };
      this.saveUsersToStorage(currentUsers);
      this.usersSubject.next([...currentUsers]);
    }
  }

  /**
   * Persist user update to backend when token is present, otherwise update local only.
   */
  async persistUserUpdate(id: string, userData: Partial<User>): Promise<boolean> {
    const token = localStorage.getItem(this.TOKEN_KEY) || undefined;
    if (!token) {
      this.updateUser(id, userData);
      return true;
    }

    try {
      const payload: any = {};
      if (userData.username) payload.username = userData.username;
      if (userData.email) payload.email = userData.email;
      if (userData.firstName) payload.first_name = userData.firstName;
      if (userData.lastName) payload.last_name = userData.lastName;
      if (userData.phone) payload.phone = userData.phone;
      if (userData.address) payload.address = userData.address;
      if (userData.birthDate) payload.birthdate = userData.birthDate;
      if ((userData as any).password) payload.password = (userData as any).password;

      const resp = await this.api.updateUser(id, payload, token);
      const envelope = resp && resp.data ? resp.data : resp;

      // Merge returned fields into local user
      const users = this.usersSubject.value.map((u) => {
        if (u.id !== id) return u;
        return {
          ...u,
          username: envelope?.username || userData.username || u.username,
          email: envelope?.email || userData.email || u.email,
          firstName: envelope?.first_name || userData.firstName || u.firstName,
          lastName: envelope?.last_name || userData.lastName || u.lastName,
          phone: envelope?.phone || userData.phone || u.phone,
          address: envelope?.address || userData.address || u.address,
          birthDate: envelope?.birthdate || userData.birthDate || u.birthDate,
        } as User;
      });

      this.saveUsersToStorage(users);
      this.usersSubject.next(users);
      return true;
    } catch (e) {
      console.warn('[UserService] persistUserUpdate failed', e);
      return false;
    }
  }

  async deleteUser(id: string): Promise<void> {
    // optimistic local delete
    const currentUsers = this.usersSubject.value.filter((user) => user.id !== id);
    this.saveUsersToStorage(currentUsers);
    this.usersSubject.next(currentUsers);

    const token = localStorage.getItem(this.TOKEN_KEY) || undefined;
    if (!token) return;

    try {
      await this.api.deleteUser(id, token);
    } catch (e) {
      console.warn('[UserService] deleteUser persist failed', e);
    }
  }

  /**
   * Add a single permission to a user and persist to backend when possible.
   * Returns true when the change was persisted or applied locally.
   */
  async addPermissionToUser(userId: string, permissionInput: any): Promise<boolean> {
    const user = this.getUserById(userId);
    if (!user) return false;

    // Determine permission identifier (string id/name) for local checks
    const permId = typeof permissionInput === 'string' ? permissionInput : (permissionInput && (permissionInput.id || permissionInput.name)) || String(permissionInput);
    if (user.permissions.includes(permId)) return true;

    const newPerms = [...user.permissions, permId];

    // Persist via backend API when token present
    const token = localStorage.getItem(this.TOKEN_KEY) || undefined;
    if (token) {
      try {
        // Pass the raw input (id, name, or object) so backend can resolve
        await this.api.addPermission(userId, permissionInput, token);
        // refresh canonical state
        // Only refresh current-user state when modifying the logged-in user
        if (String(userId) === String(this.currentUserId)) {
          await this.setCurrentUser(userId);
        } else {
          // Otherwise, fetch fresh users list without switching current user
          try { await this.syncUsers(); } catch (e) { /* ignore */ }
        }
        return true;
      } catch (e) {
        console.warn('[UserService] addPermissionToUser API persist failed', e);
      }
    }

    // Fallback local update
    try {
      this.updateUser(userId, { permissions: newPerms });
      return true;
    } catch (e) {
      console.warn('[UserService] addPermissionToUser local update failed', e);
      return false;
    }
  }

  /**
   * Remove a single permission from a user and persist to backend when possible.
   * Returns true when the change was persisted or applied locally.
   */
  async removePermissionFromUser(userId: string, permissionId: string): Promise<boolean> {
    const user = this.getUserById(userId);
    if (!user) return false;
    const newPerms = user.permissions.filter((p) => p !== permissionId);

    const token = localStorage.getItem(this.TOKEN_KEY) || undefined;
    if (token) {
      try {
        await this.api.removePermission(userId, permissionId, token);
        // update local canonical state
        if (String(userId) === String(this.currentUserId)) {
          await this.setCurrentUser(userId);
        } else {
          try { await this.syncUsers(); } catch (e) { /* ignore */ }
        }
        return true;
      } catch (e) {
        console.warn('[UserService] removePermissionFromUser API persist failed', e);
      }
    }

    try {
      this.updateUser(userId, { permissions: newPerms });
      return true;
    } catch (e) {
      console.warn('[UserService] removePermissionFromUser local update failed', e);
      return false;
    }
  }

  hasPermission(userId: string, permissionId: string): boolean {
    const user = this.getUserById(userId);
    return user ? user.permissions.includes(permissionId) : false;
  }

  isSuperAdmin(userId: string): boolean {
    const user = this.getUserById(userId);
    if (!user) return false;
    const perms = user.permissions || [];
    return perms.includes('system.admin') || user.username === 'superAdmin';
  }

  isMemberOfGroup(groupId: string): boolean {
    const current = this.getCurrentUser();
    if (!current) return false;
    if (this.isSuperAdmin(current.id)) return true;
    return current.groups.includes(groupId);
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  getPermissionsByCategory(): { [category: string]: Permission[] } {
    const permissions = this.permissionsSubject.value;
    return permissions.reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    }, {} as { [category: string]: Permission[] });
  }
}
