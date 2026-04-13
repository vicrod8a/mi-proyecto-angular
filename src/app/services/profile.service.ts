import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UserService, User } from './user.service';

export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  password?: string;
  confirmPassword?: string;
  avatar?: string;
  role?: string;
  createdDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private userSubject = new BehaviorSubject<UserProfile | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private userService: UserService) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.updateUserSubject(currentUser);
    }
    // Try to fetch canonical data from backend (if token present) so profile shows latest DB values
    (async () => {
      try {
        await this.userService.syncUsers();
      } catch (e) {
        // ignore failures; we'll still rely on local state
      }
      // subscribe to user list changes and update subject when current user exists
      this.userService.users$.subscribe(users => {
        const current = this.userService.getCurrentUser();
        if (current) {
          this.updateUserSubject(current);
        }
      });
    })();
  }

  private updateUserSubject(user: User): void {
    const userProfile: UserProfile = {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      birthDate: user.birthDate || '',
      avatar: user.avatar || 'https://via.placeholder.com/200',
      role: user.role,
      createdDate: user.createdDate
    };
    this.userSubject.next(userProfile);
  }

  getUser(): Observable<UserProfile | null> {
    return this.user$;
  }

  /**
   * Fetch latest canonical user from backend and update subject.
   */
  async refreshCurrentUser(): Promise<void> {
    const current = this.userService.getCurrentUser();
    if (!current || !current.id) return;
    try {
      const fetched = await this.userService.fetchUserById(current.id);
      if (fetched) this.updateUserSubject(fetched);
    } catch (e) {
      // ignore
    }
  }

  async updateUser(userProfile: Partial<UserProfile>): Promise<boolean> {
    if (!userProfile.id) return false;

    const updateData: Partial<User> = {
      username: userProfile.username,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
      phone: userProfile.phone,
      address: userProfile.address,
      birthDate: userProfile.birthDate
    };
    // include password when provided
    if (userProfile.password) updateData.password = userProfile.password;

    try {
      const ok = await this.userService.persistUserUpdate(userProfile.id!, updateData as any);
      if (!ok) {
        // fallback local
        this.userService.updateUser(userProfile.id!, updateData);
      }
      const updatedUser = this.userService.getUserById(userProfile.id!);
      if (updatedUser) this.updateUserSubject(updatedUser);
      return ok;
    } catch (e) {
      // attempt local update on error
      try { this.userService.updateUser(userProfile.id!, updateData); } catch {}
      const updatedUser = this.userService.getUserById(userProfile.id!);
      if (updatedUser) this.updateUserSubject(updatedUser);
      return false;
    }
  }

  deleteUser(): void {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.userService.deleteUser(currentUser.id);
      this.userSubject.next(null);
    }
  }

  getCurrentUser(): UserProfile | null {
    const current = this.userService.getCurrentUser();
    if (!current) return null;
    
    return {
      id: current.id,
      username: current.username,
      firstName: current.firstName,
      lastName: current.lastName,
      email: current.email,
      phone: current.phone || '',
      address: current.address || '',
      birthDate: current.birthDate || '',
      avatar: current.avatar || 'https://via.placeholder.com/200',
      role: current.role,
      createdDate: current.createdDate
    };
  }
}
