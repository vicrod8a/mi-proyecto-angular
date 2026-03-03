import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  joinDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private currentUser: UserProfile = {
    id: 1,
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com',
    phone: '+34 666 777 888',
    bio: 'Desarrollador Full Stack apasionado por la tecnología y la innovación.',
    avatar: 'https://via.placeholder.com/200',
    joinDate: '2024-01-15'
  };

  private userSubject = new BehaviorSubject<UserProfile>(this.currentUser);
  public user$ = this.userSubject.asObservable();

  constructor() {}

  getUser(): Observable<UserProfile> {
    return this.user$;
  }

  updateUser(user: Partial<UserProfile>): void {
    this.currentUser = { ...this.currentUser, ...user };
    this.userSubject.next(this.currentUser);
  }

  deleteUser(): void {
    // Aquí iría la lógica para eliminar la cuenta del usuario
    console.log('Usuario eliminado');
  }

  getCurrentUser(): UserProfile {
    return this.currentUser;
  }
}
