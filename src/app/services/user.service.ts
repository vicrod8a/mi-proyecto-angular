import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import UserApiClient from './user.api.client';

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
  groups: string[]; // IDs de grupos a los que pertenece
  password: string; // Added password field
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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_KEY = 'mi-proyecto-users';
  private readonly CURRENT_USER_KEY = 'mi-proyecto-current-user';
  private readonly TOKEN_KEY = 'mi-proyecto-token';
  private api = new UserApiClient();
  private usersSubject = new BehaviorSubject<User[]>(this.loadUsersFromStorage());
  public users$ = this.usersSubject.asObservable();

  private permissionsSubject = new BehaviorSubject<Permission[]>(this.getAllPermissions());
  public permissions$ = this.permissionsSubject.asObservable();

  private currentUserId: string = this.loadCurrentUserIdFromStorage() || '1';

  constructor() {}

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
    // Return default users if nothing in storage
    return this.getDefaultUsers();
  }

  private loadCurrentUserIdFromStorage(): string | null {
    const stored = localStorage.getItem(this.CURRENT_USER_KEY);
    return stored || null;
  }

  private saveUsersToStorage(users: User[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
      console.log('[UserService] Saved users to localStorage');
    } catch (e) {
      console.warn('[UserService] Error saving users to localStorage:', e);
    }
  }

  private saveCurrentUserIdToStorage(userId: string): void {
    try {
      localStorage.setItem(this.CURRENT_USER_KEY, userId);
      console.log('[UserService] Saved current user ID to localStorage:', userId);
    } catch (e) {
      console.warn('[UserService] Error saving current user ID to localStorage:', e);
    }
  }

  private getDefaultUsers(): User[] {
    return [
      {
        id: '1',
        username: 'superAdmin',
        email: 'admin@company.com',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'Super Administrator',
        permissions: this.getAllPermissions().map(p => p.id),
        isActive: true,
        createdDate: '2024-01-01',
        lastLogin: '2024-12-09',
        groups: ['equipo-dev', 'soporte'],
        password: 'SuperAdmin@123',
        phone: '+34 912 345 678',
        address: 'Calle Principal 123, Madrid, España',
        birthDate: '1985-05-15',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      {
        id: '2',
        username: 'juanperez',
        email: 'juan.perez@company.com',
        firstName: 'Juan',
        lastName: 'Pérez',
        role: 'Developer',
        permissions: ['ticket.create', 'ticket.read', 'ticket.update', 'group.read', 'group.create'],
        isActive: true,
        createdDate: '2024-01-15',
        lastLogin: '2024-12-08',
        groups: ['equipo-dev'],
        password: 'Juan@123',
        phone: '+34 678 901 234',
        address: 'Avenida Secundaria 45, Barcelona, España',
        birthDate: '1990-08-22',
        avatar: 'https://i.pravatar.cc/150?img=2'
      },
      {
        id: '3',
        username: 'mariagarcia',
        email: 'maria.garcia@company.com',
        firstName: 'María',
        lastName: 'García',
        role: 'Project Manager',
        permissions: ['ticket.read', 'ticket.update', 'group.read', 'group.update', 'user.read'],
        isActive: true,
        createdDate: '2024-02-01',
        lastLogin: '2024-12-09',
        groups: ['equipo-dev', 'soporte'],
        password: 'Maria@123',
        phone: '+34 645 789 012',
        address: 'Plaza Mayor 78, Valencia, España',
        birthDate: '1988-03-10',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      {
        id: '4',
        username: 'carlosruiz',
        email: 'carlos.ruiz@company.com',
        firstName: 'Carlos',
        lastName: 'Ruiz',
        role: 'QA Engineer',
        permissions: ['ticket.create', 'ticket.read', 'ticket.update'],
        isActive: false,
        createdDate: '2024-03-01',
        lastLogin: '2024-11-15',
        groups: ['qa'],
        password: 'Carlos@123',
        phone: '+34 612 345 678',
        address: 'Calle Secundaria 567, Sevilla, España',
        birthDate: '1992-11-30',
        avatar: 'https://i.pravatar.cc/150?img=4'
      },
      {
        id: '5',
        username: 'analopeaz',
        email: 'ana.lopez@company.com',
        firstName: 'Ana',
        lastName: 'López',
        role: 'UX Designer',
        permissions: ['ticket.create', 'ticket.read', 'ticket.update', 'group.read'],
        isActive: true,
        createdDate: '2024-02-10',
        lastLogin: '2024-12-09',
        groups: ['ux', 'equipo-dev'],
        password: 'Ana@123',
        phone: '+34 633 456 789',
        address: 'Calle del Diseño 456, Madrid, España',
        birthDate: '1993-07-17',
        avatar: 'https://i.pravatar.cc/150?img=5'
      }
    ];
  }  private getAllPermissions(): Permission[] {
    return [
      // Ticket permissions
      { id: 'ticket.create', name: 'Crear Tickets', description: 'Permite crear nuevos tickets', category: 'Tickets' },
      { id: 'ticket.read', name: 'Ver Tickets', description: 'Permite ver tickets existentes', category: 'Tickets' },
      { id: 'ticket.update', name: 'Editar Tickets', description: 'Permite editar tickets existentes', category: 'Tickets' },
      { id: 'ticket.delete', name: 'Eliminar Tickets', description: 'Permite eliminar tickets', category: 'Tickets' },

      // Group permissions
      { id: 'group.create', name: 'Crear Grupos', description: 'Permite crear nuevos grupos', category: 'Grupos' },
      { id: 'group.read', name: 'Ver Grupos', description: 'Permite ver grupos existentes', category: 'Grupos' },
      { id: 'group.update', name: 'Editar Grupos', description: 'Permite editar grupos existentes', category: 'Grupos' },
      { id: 'group.delete', name: 'Eliminar Grupos', description: 'Permite eliminar grupos', category: 'Grupos' },
      { id: 'group.manage', name: 'Gestionar Grupos', description: 'Permite acceder al panel de gestión de grupos', category: 'Grupos' },

      // User permissions
      { id: 'user.create', name: 'Crear Usuarios', description: 'Permite crear nuevos usuarios', category: 'Usuarios' },
      { id: 'user.read', name: 'Ver Usuarios', description: 'Permite ver usuarios existentes', category: 'Usuarios' },
      { id: 'user.update', name: 'Editar Usuarios', description: 'Permite editar usuarios existentes', category: 'Usuarios' },
      { id: 'user.delete', name: 'Eliminar Usuarios', description: 'Permite eliminar usuarios', category: 'Usuarios' },

      // Permission management
      { id: 'permission.manage', name: 'Gestionar Permisos', description: 'Permite asignar y quitar permisos a usuarios', category: 'Permisos' },

      // System permissions
      { id: 'system.admin', name: 'Administrador del Sistema', description: 'Acceso completo al sistema', category: 'Sistema' },
      { id: 'report.read', name: 'Ver Reportes', description: 'Permite acceder a reportes del sistema', category: 'Reportes' }
    ];
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  getPermissions(): Observable<Permission[]> {
    return this.permissions$;
  }

  getUserById(id: string): User | null {
    return this.usersSubject.value.find(user => user.id === id) || null;
  }

  getCurrentUser(): User | null {
    // In a real app, this would come from authentication service
    return this.getUserById(this.currentUserId) || null;
  }

  async login(email: string, password: string): Promise<any> {
    console.log('Intentando login con user-service y Supabase fallback:', { email });
    // Primero intentar el microservicio (auth endpoint)
    try {
      const resp = await this.api.login(email, password);
      const envelope = resp && resp.data ? resp.data : resp;
      const token = envelope?.token;
      const userPayload = envelope?.usuario || envelope?.user || envelope;
      if (token) {
        try { localStorage.setItem(this.TOKEN_KEY, token); } catch {}
      }
      if (userPayload && userPayload.id) {
        const userId = String(userPayload.id);
        this.setCurrentUser(userId);
        // merge into local users list
        const others = this.usersSubject.value.filter(u => u.id !== userId);
        const normalized: User = {
          id: userId,
          username: userPayload.name || userPayload.username || userPayload.email || '',
          email: userPayload.email || '',
          firstName: userPayload.firstName || userPayload.nombre_completo || '',
          lastName: userPayload.lastName || '',
          role: userPayload.role || userPayload.rol || '',
          permissions: userPayload.permissions || [],
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
        // After successful login, sync full users list from API
        try { await this.syncUsers(); } catch (e) { /* ignore sync errors */ }
        return { success: true, user: normalized, token };
      }
    } catch (e: any) {
      console.warn('[UserService] API login failed, falling back to Supabase', e?.message || e);
    }

    // No fallback to direct Supabase from frontend for security reasons
    return { success: false, message: 'Login falló: autenticación por API no disponible' };
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
      // If registration returned id, treat as success
      if (envelope && (envelope.id || envelope.message)) {
        return { success: true, data: envelope };
      }
      return { success: false, message: 'Registro fallido' };
    } catch (e: any) {
      return { success: false, message: e?.message || String(e) };
    }
  }

  logout(): void {
    // Remove token and current user
    try { localStorage.removeItem(this.TOKEN_KEY); } catch {}
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
    } catch (e) {
      console.warn('[UserService] syncUsers failed', e);
    }
  }

  

  setCurrentUser(userId: string): void {
    this.currentUserId = userId;
    this.saveCurrentUserIdToStorage(userId);
  }

  createUser(user: Omit<User, 'id' | 'createdDate'>): void {
    const newUser: User = {
      ...user,
      id: this.generateId(),
      createdDate: new Date().toISOString().split('T')[0]
    };
    const currentUsers = this.usersSubject.value;
    const updated = [...currentUsers, newUser];
    this.saveUsersToStorage(updated);
    this.usersSubject.next(updated);
  }

  updateUser(id: string, userData: Partial<User>): void {
    const currentUsers = this.usersSubject.value;
    const userIndex = currentUsers.findIndex(user => user.id === id);
    if (userIndex > -1) {
      currentUsers[userIndex] = { ...currentUsers[userIndex], ...userData };
      this.saveUsersToStorage(currentUsers);
      this.usersSubject.next([...currentUsers]);
    }
  }

  deleteUser(id: string): void {
    const currentUsers = this.usersSubject.value.filter(user => user.id !== id);
    this.saveUsersToStorage(currentUsers);
    this.usersSubject.next(currentUsers);
  }

  addPermissionToUser(userId: string, permissionId: string): void {
    const user = this.getUserById(userId);
    if (user && !user.permissions.includes(permissionId)) {
      this.updateUser(userId, {
        permissions: [...user.permissions, permissionId]
      });
    }
  }

  removePermissionFromUser(userId: string, permissionId: string): void {
    const user = this.getUserById(userId);
    if (user) {
      this.updateUser(userId, {
        permissions: user.permissions.filter(p => p !== permissionId)
      });
    }
  }

  hasPermission(userId: string, permissionId: string): boolean {
    const user = this.getUserById(userId);
    return user ? user.permissions.includes(permissionId) : false;
  }

  isSuperAdmin(userId: string): boolean {
    const user = this.getUserById(userId);
    return user ? user.username === 'superAdmin' : false;
  }

  /**
   * Comprueba si el usuario actual pertenece a un grupo dado.
   * Un superAdmin siempre se considera miembro.
   */
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