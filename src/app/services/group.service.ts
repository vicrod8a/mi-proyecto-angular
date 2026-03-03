import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Group {
  id: number;
  nivel: string;
  autor: string;
  nombre: string;
  integrantes: string;
  tickets: number;
  descripcion: string;
  fechaCreacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groups: Group[] = [
    {
      id: 1,
      nivel: 'Avanzado',
      autor: 'Juan Pérez',
      nombre: 'Equipo Frontend',
      integrantes: 'Juan, María, Carlos',
      tickets: 15,
      descripcion: 'Equipo especializado en desarrollo frontend con Angular',
      fechaCreacion: '2024-01-10'
    },
    {
      id: 2,
      nivel: 'Intermedio',
      autor: 'María García',
      nombre: 'Equipo Backend',
      integrantes: 'María, Pedro, Ana',
      tickets: 22,
      descripcion: 'Equipo de desarrollo backend con Node.js',
      fechaCreacion: '2024-01-15'
    }
  ];

  private groupsSubject = new BehaviorSubject<Group[]>(this.groups);
  public groups$ = this.groupsSubject.asObservable();
  private nextId = 3;

  constructor() {}

  getGroups(): Observable<Group[]> {
    return this.groups$;
  }

  addGroup(group: Omit<Group, 'id' | 'fechaCreacion'>): void {
    const newGroup: Group = {
      ...group,
      id: this.nextId++,
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    this.groups.push(newGroup);
    this.groupsSubject.next([...this.groups]);
  }

  updateGroup(id: number, group: Omit<Group, 'id' | 'fechaCreacion'>): void {
    const index = this.groups.findIndex(g => g.id === id);
    if (index > -1) {
      this.groups[index] = { ...this.groups[index], ...group };
      this.groupsSubject.next([...this.groups]);
    }
  }

  deleteGroup(id: number): void {
    this.groups = this.groups.filter(g => g.id !== id);
    this.groupsSubject.next([...this.groups]);
  }

  getGroupById(id: number): Group | undefined {
    return this.groups.find(g => g.id === id);
  }
}
