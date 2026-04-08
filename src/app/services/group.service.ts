import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isMember: boolean;
  level?: string;
  author?: string;
  members?: string;
  tickets?: number;
  createdDate?: string;
  invitationCode?: string; // Código de invitación único
  membersList?: string[]; // Lista de IDs de usuarios miembros
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private readonly STORAGE_KEY = 'mi-proyecto-groups';
  private groupsSubject = new BehaviorSubject<Group[]>(this.loadGroupsFromStorage());
  public groups$ = this.groupsSubject.asObservable();

  constructor(private userService: UserService) {
    // Update groups when user changes
    this.userService.users$.subscribe(() => {
      this.updateGroupsMembership();
    });
  }

  private loadGroupsFromStorage(): Group[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const groups = JSON.parse(stored);
        console.log('[GroupService] Loaded groups from localStorage:', groups);
        return groups;
      } catch (e) {
        console.warn('[GroupService] Error parsing stored groups:', e);
      }
    }
    // Return default groups if nothing in storage
    return this.getDefaultGroups();
  }

  private saveGroupsToStorage(groups: Group[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(groups));
      console.log('[GroupService] Saved groups to localStorage');
    } catch (e) {
      console.warn('[GroupService] Error saving groups to localStorage:', e);
    }
  }

  private updateGroupsMembership(): void {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      const currentGroups = this.groupsSubject.value;
      const updatedGroups = currentGroups.map(group => ({
        ...group,
        isMember: group.membersList?.includes(currentUser.id) || false
      }));
      this.groupsSubject.next(updatedGroups);
    }
  }

  private getDefaultGroups(): Group[] {
    return [
      {
        id: 'equipo-dev',
        name: 'Equipo Dev',
        description: 'Equipo de desarrollo principal',
        memberCount: 8,
        isMember: false,
        level: 'Avanzado',
        author: 'Juan Pérez',
        members: 'Juan, María, Carlos, Pedro',
        tickets: 15,
        createdDate: '2024-01-10',
        invitationCode: 'DEV2024',
        membersList: ['1', '2', '3', '5'] // SuperAdmin, Juan, María, Ana
      },
      {
        id: 'soporte',
        name: 'Soporte',
        description: 'Equipo de soporte técnico',
        memberCount: 5,
        isMember: false,
        level: 'Intermedio',
        author: 'María García',
        members: 'María, Pedro, Ana',
        tickets: 22,
        createdDate: '2024-01-15',
        invitationCode: 'SUP2024',
        membersList: ['1', '3'] // SuperAdmin, María
      },
      {
        id: 'ux',
        name: 'UX',
        description: 'Equipo de experiencia de usuario',
        memberCount: 4,
        isMember: false,
        level: 'Avanzado',
        author: 'Ana López',
        members: 'Ana, Luis, Carmen',
        tickets: 8,
        createdDate: '2024-02-01',
        invitationCode: 'UX2024',
        membersList: ['5'] // Ana
      },
      {
        id: 'qa',
        name: 'QA',
        description: 'Equipo de control de calidad',
        memberCount: 3,
        isMember: false,
        level: 'Intermedio',
        author: 'Carlos Ruiz',
        members: 'Carlos, Elena',
        tickets: 12,
        createdDate: '2024-02-10',
        invitationCode: 'QA2024',
        membersList: ['4'] // Carlos
      },
      {
        id: 'marketing',
        name: 'Marketing',
        description: 'Equipo de marketing digital',
        memberCount: 6,
        isMember: false,
        level: 'Básico',
        author: 'Luis Martín',
        members: 'Luis, Sofia, Miguel, Laura',
        tickets: 18,
        createdDate: '2024-02-20',
        invitationCode: 'MKT2024',
        membersList: [] // Sin miembros iniciales
      },
      {
        id: 'ventas',
        name: 'Ventas',
        description: 'Equipo comercial',
        memberCount: 7,
        isMember: false,
        level: 'Intermedio',
        author: 'Miguel Torres',
        members: 'Miguel, Laura, Roberto, Patricia',
        tickets: 25,
        createdDate: '2024-03-01',
        invitationCode: 'VEN2024',
        membersList: [] // Sin miembros iniciales
      }
    ];
  }

  getGroups(): Observable<Group[]> {
    return this.groups$;
  }

  getMyGroups(): Group[] {
    return this.groupsSubject.value.filter(group => group.isMember);
  }

  getAllGroups(): Group[] {
    return this.groupsSubject.value;
  }

  getGroupById(id: string): Group | undefined {
    return this.groupsSubject.value.find(group => group.id === id);
  }

  createGroup(group: Omit<Group, 'id' | 'isMember' | 'memberCount' | 'createdDate' | 'invitationCode' | 'membersList'>): void {
    const newGroup: Group = {
      ...group,
      id: this.generateId(),
      isMember: false,
      memberCount: 0,
      createdDate: new Date().toISOString().split('T')[0],
      invitationCode: this.generateInvitationCode(),
      membersList: []
    };
    const currentGroups = this.groupsSubject.value;
    const updated = [...currentGroups, newGroup];
    this.saveGroupsToStorage(updated);
    this.groupsSubject.next(updated);
  }

  updateGroup(id: string, updates: Partial<Group>): void {
    const currentGroups = this.groupsSubject.value;
    const index = currentGroups.findIndex(g => g.id === id);
    if (index > -1) {
      currentGroups[index] = { ...currentGroups[index], ...updates };
      this.saveGroupsToStorage(currentGroups);
      this.groupsSubject.next([...currentGroups]);
    }
  }

  deleteGroup(id: string): void {
    const currentGroups = this.groupsSubject.value.filter(g => g.id !== id);
    this.saveGroupsToStorage(currentGroups);
    this.groupsSubject.next(currentGroups);
  }

  joinGroup(groupId: string): void {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser && !this.isUserMemberOfGroup(currentUser.id, groupId)) {
      const group = this.getGroupById(groupId);
      if (group) {
        // Add user to group's member list
        const updatedGroup = {
          ...group,
          membersList: [...(group.membersList || []), currentUser.id],
          memberCount: (group.memberCount || 0) + 1
        };
        this.updateGroup(groupId, updatedGroup);
        
        // Add group to user's groups
        this.userService.updateUser(currentUser.id, {
          groups: [...currentUser.groups, groupId]
        });
      }
    }
  }

  leaveGroup(groupId: string): void {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser && this.isUserMemberOfGroup(currentUser.id, groupId)) {
      const group = this.getGroupById(groupId);
      if (group) {
        // Remove user from group's member list
        const updatedGroup = {
          ...group,
          membersList: (group.membersList || []).filter(id => id !== currentUser.id),
          memberCount: Math.max(0, (group.memberCount || 0) - 1)
        };
        this.updateGroup(groupId, updatedGroup);
        
        // Remove group from user's groups
        this.userService.updateUser(currentUser.id, {
          groups: currentUser.groups.filter(id => id !== groupId)
        });
      }
    }
  }

  generateInvitationCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  regenerateInvitationCode(groupId: string): string {
    const newCode = this.generateInvitationCode();
    this.updateGroup(groupId, { invitationCode: newCode });
    return newCode;
  }

  joinGroupByCode(invitationCode: string): boolean {
    const group = this.groupsSubject.value.find(g => g.invitationCode === invitationCode);
    if (group) {
      this.joinGroup(group.id);
      return true;
    }
    return false;
  }

  isUserMemberOfGroup(userId: string, groupId: string): boolean {
    const group = this.getGroupById(groupId);
    return group?.membersList?.includes(userId) || false;
  }

  getGroupMembers(groupId: string): string[] {
    const group = this.getGroupById(groupId);
    return group?.membersList || [];
  }

  addUserToGroup(userId: string, groupId: string): void {
    const group = this.getGroupById(groupId);
    if (group && !this.isUserMemberOfGroup(userId, groupId)) {
      const updatedGroup = {
        ...group,
        membersList: [...(group.membersList || []), userId],
        memberCount: (group.memberCount || 0) + 1
      };
      this.updateGroup(groupId, updatedGroup);
      
      // Add group to user's groups
      const user = this.userService.getUserById(userId);
      if (user) {
        this.userService.updateUser(userId, {
          groups: [...user.groups, groupId]
        });
      }
    }
  }

  removeUserFromGroup(userId: string, groupId: string): void {
    const group = this.getGroupById(groupId);
    if (group && this.isUserMemberOfGroup(userId, groupId)) {
      const updatedGroup = {
        ...group,
        membersList: (group.membersList || []).filter(id => id !== userId),
        memberCount: Math.max(0, (group.memberCount || 0) - 1)
      };
      this.updateGroup(groupId, updatedGroup);
      
      // Remove group from user's groups
      const user = this.userService.getUserById(userId);
      if (user) {
        this.userService.updateUser(userId, {
          groups: user.groups.filter(id => id !== groupId)
        });
      }
    }
  }

  private generateId(): string {
    return 'group-' + Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
