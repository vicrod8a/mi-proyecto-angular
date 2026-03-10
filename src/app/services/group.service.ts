import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groupsSubject = new BehaviorSubject<Group[]>(this.getAvailableGroups());
  public groups$ = this.groupsSubject.asObservable();

  constructor() { }

  private getAvailableGroups(): Group[] {
    return [
      {
        id: 'equipo-dev',
        name: 'Equipo Dev',
        description: 'Equipo de desarrollo principal',
        memberCount: 8,
        isMember: true,
        level: 'Avanzado',
        author: 'Juan Pérez',
        members: 'Juan, María, Carlos, Pedro',
        tickets: 15,
        createdDate: '2024-01-10'
      },
      {
        id: 'soporte',
        name: 'Soporte',
        description: 'Equipo de soporte técnico',
        memberCount: 5,
        isMember: true,
        level: 'Intermedio',
        author: 'María García',
        members: 'María, Pedro, Ana',
        tickets: 22,
        createdDate: '2024-01-15'
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
        createdDate: '2024-02-01'
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
        createdDate: '2024-02-10'
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
        createdDate: '2024-02-20'
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
        createdDate: '2024-03-01'
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
}
