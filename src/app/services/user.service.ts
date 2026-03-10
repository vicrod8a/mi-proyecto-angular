import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  private usersSubject = new BehaviorSubject<User[]>(this.getInitialUsers());
  public users$ = this.usersSubject.asObservable();

  private permissionsSubject = new BehaviorSubject<Permission[]>(this.getAllPermissions());
  public permissions$ = this.permissionsSubject.asObservable();

  constructor() { }

  private getInitialUsers(): User[] {
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
        groups: ['equipo-dev', 'soporte']
      },
      {
        id: '2',
        username: 'juanperez',
        email: 'juan.perez@company.com',
        firstName: 'Juan',
        lastName: 'Pérez',
        role: 'Developer',
        permissions: ['ticket.create', 'ticket.read', 'ticket.update', 'group.read'],
        isActive: true,
        createdDate: '2024-01-15',
        lastLogin: '2024-12-08',
        groups: ['equipo-dev']
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
        groups: ['equipo-dev', 'soporte']
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
        groups: ['qa']
      }
    ];
  }

  private getAllPermissions(): Permission[] {
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

      // User permissions
      { id: 'user.create', name: 'Crear Usuarios', description: 'Permite crear nuevos usuarios', category: 'Usuarios' },
      { id: 'user.read', name: 'Ver Usuarios', description: 'Permite ver usuarios existentes', category: 'Usuarios' },
      { id: 'user.update', name: 'Editar Usuarios', description: 'Permite editar usuarios existentes', category: 'Usuarios' },
      { id: 'user.delete', name: 'Eliminar Usuarios', description: 'Permite eliminar usuarios', category: 'Usuarios' },

      // Permission management
      { id: 'permission.manage', name: 'Gestionar Permisos', description: 'Permite asignar y quitar permisos a usuarios', category: 'Permisos' },

      // System permissions
      { id: 'system.admin', name: 'Administrador del Sistema', description: 'Acceso completo al sistema', category: 'Sistema' },
      { id: 'reports.view', name: 'Ver Reportes', description: 'Permite acceder a reportes del sistema', category: 'Reportes' }
    ];
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  getPermissions(): Observable<Permission[]> {
    return this.permissions$;
  }

  getUserById(id: string): User | undefined {
    return this.usersSubject.value.find(user => user.id === id);
  }

  getCurrentUser(): User | null {
    // In a real app, this would come from authentication service
    // For now, return superAdmin as current user
    return this.getUserById('1') || null;
  }

  createUser(user: Omit<User, 'id' | 'createdDate'>): void {
    const newUser: User = {
      ...user,
      id: this.generateId(),
      createdDate: new Date().toISOString().split('T')[0]
    };
    const currentUsers = this.usersSubject.value;
    this.usersSubject.next([...currentUsers, newUser]);
  }

  updateUser(id: string, userData: Partial<User>): void {
    const currentUsers = this.usersSubject.value;
    const userIndex = currentUsers.findIndex(user => user.id === id);
    if (userIndex > -1) {
      currentUsers[userIndex] = { ...currentUsers[userIndex], ...userData };
      this.usersSubject.next([...currentUsers]);
    }
  }

  deleteUser(id: string): void {
    const currentUsers = this.usersSubject.value.filter(user => user.id !== id);
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