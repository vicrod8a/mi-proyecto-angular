import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isMember: boolean;
  membershipStatus?: 'owner' | 'member' | 'invited' | 'none';
  ownerUserId?: string;
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
  private groupsSubject = new BehaviorSubject<Group[]>([]);
  public groups$ = this.groupsSubject.asObservable();

  constructor(private userService: UserService) {
    // Update groups when user changes
    this.userService.users$.subscribe(() => {
      this.updateGroupsMembership();
    });
    // Fetch groups from backend on init
    this.fetchGroupsFromServer();
  }

  // Fetch groups from backend and update in-memory state
  private async fetchGroupsFromServer(): Promise<void> {
    try {
      const token = localStorage.getItem('mi-proyecto-token') || localStorage.getItem('supabase.auth.token');
      const res = await fetch('http://127.0.0.1:3000/groups', {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const body = await res.json();
        const data = body?.data || [];
        const currentUser = this.userService.getCurrentUser();
        const mapped: Group[] = data.map((g: any) => ({
          id: String(g.id),
          name: g.name,
          description: g.description,
          memberCount: g.member_count ?? 0,
          membershipStatus: g.membership_status ?? 'none',
          isMember: currentUser ? ( (g.membership_status === 'member' || g.membership_status === 'owner') || (Array.isArray(g.members_list) ? g.members_list.map(String).includes(String(currentUser.id)) : false) ) : false,
          ownerUserId: g.owner_user_id ? String(g.owner_user_id) : undefined,
          createdDate: g.created_at ? String(g.created_at).split('T')[0] : undefined,
          invitationCode: g.invitation_code ?? undefined,
          level: g.level ?? undefined,
          membersList: Array.isArray(g.members_list) ? g.members_list.map(String) : []
        } as Group));
        this.groupsSubject.next(mapped);
      } else {
        console.warn('[GroupService] Failed to fetch groups from server', res.status);
        this.groupsSubject.next([]);
      }
    } catch (e) {
      console.warn('[GroupService] Error fetching groups from server:', e);
      this.groupsSubject.next([]);
    }
  }

  private updateGroupsMembership(): void {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      const currentGroups = this.groupsSubject.value;
      const updatedGroups = currentGroups.map(group => ({
        ...group,
        isMember: group.membersList?.map(String).includes(String(currentUser.id)) || false
      }));
      this.groupsSubject.next(updatedGroups);
    }
  }

  private getDefaultGroups(): Group[] {
    return [];
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

  async createGroup(group: Omit<Group, 'id' | 'isMember' | 'memberCount' | 'createdDate' | 'invitationCode' | 'membersList'>): Promise<Group> {
    // Try to create on server first; fall back to local-only behavior if network fails
    const token = localStorage.getItem('mi-proyecto-token') || localStorage.getItem('supabase.auth.token');
    const currentUser = this.userService.getCurrentUser();
    const payload: any = { name: group.name, description: group.description };

    if ((group as any).level) {
      payload.level = (group as any).level;
    }

    // Always include owner_user_id when we have a current user so backend can reliably assign membership
    // Allow form to override owner (ownerUserId) when provided; otherwise use current user
    if ((group as any).ownerUserId) {
      payload.owner_user_id = (group as any).ownerUserId;
    } else if (currentUser) {
      payload.owner_user_id = currentUser.id;
    }

    try {
      if (token) {
        const res = await fetch('http://127.0.0.1:3000/groups', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const body = await res.json();
          const created = body?.data;
          if (created) {
            const newGroup: Group = {
              id: String(created.id),
              name: created.name,
              description: created.description,
              memberCount: created.member_count ?? 0,
              isMember: (currentUser && String(created.owner_user_id) === String(currentUser.id)) || false,
              ownerUserId: created.owner_user_id ? String(created.owner_user_id) : undefined,
              createdDate: created.created_at ? created.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
              invitationCode: created.invitation_code ?? this.generateInvitationCode(),
              level: created.level ?? payload.level ?? 'Básico',
              membersList: Array.isArray(created.members_list) ? created.members_list.map(String) : (created.members_list ?? [])
            } as Group;
            const currentGroups = this.groupsSubject.value;
            const updated = [...currentGroups, newGroup];
            // update in-memory groups only (do not persist to localStorage)
            this.groupsSubject.next(updated);
            // If current user created the group, update their groups and mark membership
            if (currentUser && String(created.owner_user_id) === String(currentUser.id)) {
              try {
                // update local user groups optimistically
                this.userService.updateUser(currentUser.id, {
                  groups: [...(currentUser.groups || []), String(created.id)]
                });
                // ensure membersList contains current user
                newGroup.membersList = [...(newGroup.membersList || []), currentUser.id];
                this.updateGroup(newGroup.id, { membersList: newGroup.membersList, memberCount: (newGroup.memberCount || 0) + 1 });
              } catch (e) {
                console.warn('[GroupService] Failed to update current user groups locally:', e);
              }
            }
            return newGroup;
          }
        } else if (res.status === 409) {
          console.warn('[GroupService] Group name already exists');
          throw new Error('Group name already exists');
        } else {
          console.warn('[GroupService] Server returned', res.status);
          // fall through to local fallback
        }
      }
    } catch (e) {
      console.warn('[GroupService] Server create failed:', e);
      throw e;
    }
    // Should not reach here because successful path returns
    throw new Error('Failed to create group');
  }

  async updateGroup(id: string, updates: Partial<Group>): Promise<Group> {
    // Optimistically update in-memory
    const currentGroups = this.groupsSubject.value;
    const index = currentGroups.findIndex(g => g.id === id);
    let updatedGroup: Group | null = null;
    if (index > -1) {
      currentGroups[index] = { ...currentGroups[index], ...updates };
      this.groupsSubject.next([...currentGroups]);
      updatedGroup = currentGroups[index];
    }

    try {
      const token = localStorage.getItem('mi-proyecto-token') || localStorage.getItem('supabase.auth.token');
      const res = await fetch(`http://127.0.0.1:3000/groups/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ name: updates.name, description: updates.description, level: updates.level })
      });
      if (res.ok) {
        const body = await res.json();
        const g = body?.data;
        if (g) {
          const mapped: Group = {
            id: String(g.id),
            name: g.name,
            description: g.description,
            memberCount: g.member_count ?? (updatedGroup?.memberCount ?? 0),
            isMember: updatedGroup?.isMember ?? false,
            ownerUserId: g.owner_user_id ? String(g.owner_user_id) : updatedGroup?.ownerUserId,
            createdDate: g.created_at ? String(g.created_at).split('T')[0] : updatedGroup?.createdDate,
            invitationCode: g.invitation_code ?? updatedGroup?.invitationCode,
            level: g.level ?? updatedGroup?.level,
            membersList: Array.isArray(g.members_list) ? g.members_list.map(String) : updatedGroup?.membersList ?? []
          } as Group;
          const all = this.groupsSubject.value.map(x => x.id === mapped.id ? mapped : x);
          this.groupsSubject.next(all);
          return mapped;
        }
      }
      throw new Error(`Server returned ${res.status}`);
    } catch (e) {
      console.warn('[GroupService] Failed to persist group update to server:', e);
      if (updatedGroup) return updatedGroup;
      throw e;
    }
  }

  async deleteGroup(id: string): Promise<void> {
    // Optimistically remove
    const before = this.groupsSubject.value;
    this.groupsSubject.next(before.filter(g => g.id !== id));
    try {
      const token = localStorage.getItem('mi-proyecto-token') || localStorage.getItem('supabase.auth.token');
      const res = await fetch(`http://127.0.0.1:3000/groups/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) {
        // rollback
        this.groupsSubject.next(before);
        throw new Error(`Server returned ${res.status}`);
      }
    } catch (e) {
      console.warn('[GroupService] Failed to delete group on server:', e);
      // rollback
      this.groupsSubject.next(before);
      throw e;
    }
  }
  joinGroup(groupId: string): void {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) return;
    // optimistic
    const group = this.getGroupById(groupId);
    const before = this.groupsSubject.value;
    if (group && !this.isUserMemberOfGroup(currentUser.id, groupId)) {
      const updatedGroup = { ...group, membersList: [...(group.membersList || []), currentUser.id], memberCount: (group.memberCount || 0) + 1, isMember: true, membershipStatus: 'member' } as Group;
      this.groupsSubject.next(this.groupsSubject.value.map(g => g.id === groupId ? updatedGroup : g));
      this.userService.updateUser(currentUser.id, { groups: [...(currentUser.groups || []), groupId] });
      // persist to backend
      const token = localStorage.getItem('mi-proyecto-token') || localStorage.getItem('supabase.auth.token');
      fetch(`http://127.0.0.1:3000/groups/${encodeURIComponent(groupId)}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
        body: JSON.stringify({ user_id: currentUser.id })
      }).then(async res => {
        if (res.ok) {
          const body = await res.json();
          const g = body?.data;
          if (g) {
            const mapped: Group = {
              id: String(g.id),
              name: g.name,
              description: g.description,
              memberCount: g.member_count ?? updatedGroup.memberCount,
              membershipStatus: g.membership_status ?? 'none',
              isMember: (g.membership_status === 'member' || g.membership_status === 'owner') || true,
              ownerUserId: g.owner_user_id ? String(g.owner_user_id) : updatedGroup.ownerUserId,
              createdDate: g.created_at ? String(g.created_at).split('T')[0] : updatedGroup.createdDate,
              invitationCode: g.invitation_code ?? updatedGroup.invitationCode,
              level: g.level ?? updatedGroup.level,
              membersList: Array.isArray(g.members_list) ? g.members_list.map(String) : updatedGroup.membersList
            } as Group;
            this.groupsSubject.next(this.groupsSubject.value.map(x => x.id === mapped.id ? mapped : x));
          }
        } else {
          // rollback
          this.groupsSubject.next(before);
        }
      }).catch(() => {
        this.groupsSubject.next(before);
      });
    }
  }

  leaveGroup(groupId: string): void {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) return;
    if (this.isUserMemberOfGroup(currentUser.id, groupId)) {
      const group = this.getGroupById(groupId);
      if (!group) return;
      const before = this.groupsSubject.value;
      const updatedGroup = { ...group, membersList: (group.membersList || []).filter(id => id !== currentUser.id), memberCount: Math.max(0, (group.memberCount || 0) - 1), isMember: false, membershipStatus: 'none' } as Group;
      this.groupsSubject.next(this.groupsSubject.value.map(g => g.id === groupId ? updatedGroup : g));
      this.userService.updateUser(currentUser.id, { groups: (currentUser.groups || []).filter(id => id !== groupId) });
      const token = localStorage.getItem('mi-proyecto-token') || localStorage.getItem('supabase.auth.token');
      fetch(`http://127.0.0.1:3000/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(currentUser.id)}`, {
        method: 'DELETE',
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      }).then(async res => {
        if (res.ok) {
          const body = await res.json();
          const g = body?.data;
          if (g) {
            const mapped: Group = {
              id: String(g.id),
              name: g.name,
              description: g.description,
              memberCount: g.member_count ?? updatedGroup.memberCount,
              membershipStatus: g.membership_status ?? 'none',
              isMember: (g.membership_status === 'member' || g.membership_status === 'owner') || false,
              ownerUserId: g.owner_user_id ? String(g.owner_user_id) : updatedGroup.ownerUserId,
              createdDate: g.created_at ? String(g.created_at).split('T')[0] : updatedGroup.createdDate,
              invitationCode: g.invitation_code ?? updatedGroup.invitationCode,
              level: g.level ?? updatedGroup.level,
              membersList: Array.isArray(g.members_list) ? g.members_list.map(String) : updatedGroup.membersList
            } as Group;
            this.groupsSubject.next(this.groupsSubject.value.map(x => x.id === mapped.id ? mapped : x));
          }
        } else {
          this.groupsSubject.next(before);
        }
      }).catch(() => {
        this.groupsSubject.next(before);
      });
    }
  }

  acceptInvitation(groupId: string): void {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) return;
    const group = this.getGroupById(groupId);
    if (!group) return;
    // optimistic
    const before = this.groupsSubject.value;
    const updatedGroup = { ...group, membersList: [...(group.membersList || []), currentUser.id], memberCount: (group.memberCount || 0) + 1, isMember: true, membershipStatus: 'member' } as Group;
    this.groupsSubject.next(this.groupsSubject.value.map(g => g.id === groupId ? updatedGroup : g));
    this.userService.updateUser(currentUser.id, { groups: [...(currentUser.groups || []), groupId] });
    const token = localStorage.getItem('mi-proyecto-token') || localStorage.getItem('supabase.auth.token');
    fetch(`http://127.0.0.1:3000/groups/${encodeURIComponent(groupId)}/members/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
      body: JSON.stringify({ user_id: currentUser.id })
    }).then(async res => {
      if (res.ok) {
        const body = await res.json();
        const g = body?.data;
        if (g) {
          const mapped: Group = {
            id: String(g.id),
            name: g.name,
            description: g.description,
            memberCount: g.member_count ?? updatedGroup.memberCount,
            membershipStatus: g.membership_status ?? 'member',
            isMember: (g.membership_status === 'member' || g.membership_status === 'owner') || true,
            ownerUserId: g.owner_user_id ? String(g.owner_user_id) : updatedGroup.ownerUserId,
            createdDate: g.created_at ? String(g.created_at).split('T')[0] : updatedGroup.createdDate,
            invitationCode: g.invitation_code ?? updatedGroup.invitationCode,
            level: g.level ?? updatedGroup.level,
            membersList: Array.isArray(g.members_list) ? g.members_list.map(String) : updatedGroup.membersList
          } as Group;
          this.groupsSubject.next(this.groupsSubject.value.map(x => x.id === mapped.id ? mapped : x));
        }
      } else {
        this.groupsSubject.next(before);
      }
    }).catch(() => this.groupsSubject.next(before));
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

  async joinGroupByCode(invitationCode: string): Promise<boolean> {
    const token = localStorage.getItem('mi-proyecto-token') || localStorage.getItem('supabase.auth.token');
    try {
      const res = await fetch('http://127.0.0.1:3000/groups/join-by-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
        body: JSON.stringify({ code: invitationCode })
      });
      if (!res.ok) return false;
      const body = await res.json();
      const g = body?.data;
      if (!g) return false;
      const mapped: Group = {
        id: String(g.id),
        name: g.name,
        description: g.description,
        memberCount: g.member_count ?? 0,
        membershipStatus: g.membership_status ?? 'member',
        isMember: (g.membership_status === 'member' || g.membership_status === 'owner') || false,
        ownerUserId: g.owner_user_id ? String(g.owner_user_id) : undefined,
        createdDate: g.created_at ? String(g.created_at).split('T')[0] : undefined,
        invitationCode: g.invitation_code ?? undefined,
        level: g.level ?? undefined,
        membersList: Array.isArray(g.members_list) ? g.members_list.map(String) : []
      } as Group;
      // update or insert in local store
      const exists = this.groupsSubject.value.find(x => String(x.id) === mapped.id);
      if (exists) {
        this.groupsSubject.next(this.groupsSubject.value.map(x => x.id === mapped.id ? mapped : x));
      } else {
        this.groupsSubject.next([...this.groupsSubject.value, mapped]);
      }
      return true;
    } catch (e) {
      console.warn('[GroupService] joinGroupByCode failed', e);
      return false;
    }
  }

  isUserMemberOfGroup(userId: string, groupId: string): boolean {
    const group = this.getGroupById(groupId);
    return group?.membersList?.map(String).includes(String(userId)) || false;
  }

  getGroupMembers(groupId: string): string[] {
    const group = this.getGroupById(groupId);
    return group?.membersList || [];
  }

  addUserToGroup(userId: string, groupId: string): void {
    // Use backend endpoint to add membership
    const group = this.getGroupById(groupId);
    if (!group || this.isUserMemberOfGroup(userId, groupId)) return;
    const before = this.groupsSubject.value;
    const updatedGroup = { ...group, membersList: [...(group.membersList || []), userId], memberCount: (group.memberCount || 0) + 1 } as Group;
    this.groupsSubject.next(this.groupsSubject.value.map(g => g.id === groupId ? updatedGroup : g));
    const token = localStorage.getItem('mi-proyecto-token') || localStorage.getItem('supabase.auth.token');
    fetch(`http://127.0.0.1:3000/groups/${encodeURIComponent(groupId)}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
      body: JSON.stringify({ user_id: userId })
    }).then(async res => {
      if (res.ok) {
        const body = await res.json();
        const g = body?.data;
          if (g) {
          const mapped: Group = {
            id: String(g.id),
            name: g.name,
            description: g.description,
            memberCount: g.member_count ?? updatedGroup.memberCount,
              membershipStatus: g.membership_status ?? 'none',
              isMember: (g.membership_status === 'member' || g.membership_status === 'owner') || updatedGroup.isMember,
            ownerUserId: g.owner_user_id ? String(g.owner_user_id) : updatedGroup.ownerUserId,
            createdDate: g.created_at ? String(g.created_at).split('T')[0] : updatedGroup.createdDate,
            invitationCode: g.invitation_code ?? updatedGroup.invitationCode,
            level: g.level ?? updatedGroup.level,
            membersList: Array.isArray(g.members_list) ? g.members_list.map(String) : updatedGroup.membersList
          } as Group;
          this.groupsSubject.next(this.groupsSubject.value.map(x => x.id === mapped.id ? mapped : x));
        }
      } else {
        this.groupsSubject.next(before);
      }
    }).catch(() => this.groupsSubject.next(before));
  }

  removeUserFromGroup(userId: string, groupId: string): void {
    const group = this.getGroupById(groupId);
    if (!group || !this.isUserMemberOfGroup(userId, groupId)) return;
    const before = this.groupsSubject.value;
    const updatedGroup = { ...group, membersList: (group.membersList || []).filter(id => id !== userId), memberCount: Math.max(0, (group.memberCount || 0) - 1) } as Group;
    this.groupsSubject.next(this.groupsSubject.value.map(g => g.id === groupId ? updatedGroup : g));
    const token = localStorage.getItem('mi-proyecto-token') || localStorage.getItem('supabase.auth.token');
    fetch(`http://127.0.0.1:3000/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
    }).then(async res => {
      if (res.ok) {
        const body = await res.json();
        const g = body?.data;
          if (g) {
          const mapped: Group = {
            id: String(g.id),
            name: g.name,
            description: g.description,
            memberCount: g.member_count ?? updatedGroup.memberCount,
              membershipStatus: g.membership_status ?? 'none',
              isMember: (g.membership_status === 'member' || g.membership_status === 'owner') || this.isUserMemberOfGroup((this.userService.getCurrentUser()?.id || ''), String(g.id)),
            ownerUserId: g.owner_user_id ? String(g.owner_user_id) : updatedGroup.ownerUserId,
            createdDate: g.created_at ? String(g.created_at).split('T')[0] : updatedGroup.createdDate,
            invitationCode: g.invitation_code ?? updatedGroup.invitationCode,
            level: g.level ?? updatedGroup.level,
            membersList: Array.isArray(g.members_list) ? g.members_list.map(String) : updatedGroup.membersList
          } as Group;
          this.groupsSubject.next(this.groupsSubject.value.map(x => x.id === mapped.id ? mapped : x));
        }
      } else {
        this.groupsSubject.next(before);
      }
    }).catch(() => this.groupsSubject.next(before));
  }

  async transferOwner(groupId: string, newOwnerId: string): Promise<Group | null> {
    try {
      const token = localStorage.getItem('mi-proyecto-token') || localStorage.getItem('supabase.auth.token');
      const res = await fetch(`http://127.0.0.1:3000/groups/${encodeURIComponent(groupId)}/transfer-owner`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
        body: JSON.stringify({ new_owner_id: newOwnerId })
      });
      if (!res.ok) throw new Error(String(res.status));
      const body = await res.json();
      const g = body?.data;
      if (!g) return null;
      const mapped: Group = {
        id: String(g.id),
        name: g.name,
        description: g.description,
        memberCount: g.member_count ?? 0,
        membershipStatus: g.membership_status ?? 'none',
        isMember: (g.membership_status === 'member' || g.membership_status === 'owner') || this.isUserMemberOfGroup(this.userService.getCurrentUser()?.id || '', String(g.id)),
        ownerUserId: g.owner_user_id ? String(g.owner_user_id) : undefined,
        createdDate: g.created_at ? String(g.created_at).split('T')[0] : undefined,
        invitationCode: g.invitation_code ?? undefined,
        level: g.level ?? undefined,
        membersList: Array.isArray(g.members_list) ? g.members_list.map(String) : []
      } as Group;
      this.groupsSubject.next(this.groupsSubject.value.map(x => x.id === mapped.id ? mapped : x));
      return mapped;
    } catch (e) {
      console.warn('[GroupService] transferOwner failed', e);
      return null;
    }
  }

  private generateId(): string {
    return 'group-' + Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
