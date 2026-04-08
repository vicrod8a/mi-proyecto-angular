import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TicketService } from './ticket.service';
import { GroupService } from './group.service';
import { UserService } from './user.service';
import { Ticket } from '../models/ticket.model';

export interface TicketReport {
  totalTickets: number;
  byStatus: {
    pendiente: number;
    'en progreso': number;
    revisión: number;
    hecho: number;
  };
  byPriority: {
    baja: number;
    media: number;
    alta: number;
    crítica: number;
  };
  byGroup: { [groupId: string]: number };
  byAssignee: { [username: string]: number };
  averageResolutionTime?: number;
}

export interface GroupReport {
  totalGroups: number;
  totalMembers: number;
  groupDetails: {
    id: string;
    name: string;
    description: string;
    members: number;
    ticketsCount: number;
    ticketsStatus: {
      pendiente: number;
      'en progreso': number;
      revisión: number;
      hecho: number;
    };
  }[];
}

export interface UserReport {
  totalUsers: number;
  activeUsers: number;
  userStats: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    ticketsCreated: number;
    ticketsAssigned: number;
    permissions: number;
    createdDate: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private ticketReportSubject = new BehaviorSubject<TicketReport | null>(null);
  private groupReportSubject = new BehaviorSubject<GroupReport | null>(null);
  private userReportSubject = new BehaviorSubject<UserReport | null>(null);

  public ticketReport$ = this.ticketReportSubject.asObservable();
  public groupReport$ = this.groupReportSubject.asObservable();
  public userReport$ = this.userReportSubject.asObservable();

  constructor(
    private ticketService: TicketService,
    private groupService: GroupService,
    private userService: UserService
  ) {
    // Load reports when services have data
    this.subscribeToDataChanges();
  }

  private subscribeToDataChanges(): void {
    this.ticketService.getTickets().subscribe(() => {
      this.generateTicketReport();
    });

    this.groupService.getGroups().subscribe(() => {
      this.generateGroupReport();
    });

    this.userService.getUsers().subscribe(() => {
      this.generateUserReport();
    });
  }

  generateTicketReport(): void {
    this.ticketService.getTickets().subscribe(tickets => {
      const report: TicketReport = {
        totalTickets: tickets.length,
        byStatus: {
          pendiente: 0,
          'en progreso': 0,
          revisión: 0,
          hecho: 0
        },
        byPriority: {
          baja: 0,
          media: 0,
          alta: 0,
          crítica: 0
        },
        byGroup: {},
        byAssignee: {}
      };

      tickets.forEach(ticket => {
        // By Status
        const status = ticket.status.toLowerCase();
        if (status in report.byStatus) {
          report.byStatus[status as keyof typeof report.byStatus]++;
        }

        // By Priority
        const priority = ticket.priority?.toLowerCase() || 'media';
        if (priority in report.byPriority) {
          report.byPriority[priority as keyof typeof report.byPriority]++;
        }

        // By Group
        if (ticket.groupId) {
          report.byGroup[ticket.groupId] = (report.byGroup[ticket.groupId] || 0) + 1;
        }

        // By Assignee
        if (ticket.assignedTo) {
          report.byAssignee[ticket.assignedTo] = (report.byAssignee[ticket.assignedTo] || 0) + 1;
        }
      });

      this.ticketReportSubject.next(report);
    });
  }

  generateGroupReport(): void {
    this.groupService.getGroups().subscribe(groups => {
      this.ticketService.getTickets().subscribe(tickets => {
        const report: GroupReport = {
          totalGroups: groups.length,
          totalMembers: groups.reduce((sum, g) => sum + (g.members?.length || 0), 0),
          groupDetails: groups.map(group => {
            const groupTickets = tickets.filter(t => t.groupId === group.id);
            const ticketsByStatus = {
              pendiente: 0,
              'en progreso': 0,
              revisión: 0,
              hecho: 0
            };

            groupTickets.forEach(ticket => {
              const status = ticket.status.toLowerCase();
              if (status in ticketsByStatus) {
                ticketsByStatus[status as keyof typeof ticketsByStatus]++;
              }
            });

            return {
              id: group.id,
              name: group.name,
              description: group.description,
              members: group.members?.length || 0,
              ticketsCount: groupTickets.length,
              ticketsStatus: ticketsByStatus
            };
          })
        };

        this.groupReportSubject.next(report);
      });
    });
  }

  generateUserReport(): void {
    this.userService.getUsers().subscribe(users => {
      this.ticketService.getTickets().subscribe(tickets => {
        const report: UserReport = {
          totalUsers: users.length,
          activeUsers: users.length,
          userStats: users.map(user => {
            const ticketsCreated = tickets.filter(t => t.creator === user.username).length;
            const ticketsAssigned = tickets.filter(t => t.assignedTo === user.firstName).length;

            return {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              ticketsCreated,
              ticketsAssigned,
              permissions: user.permissions?.length || 0,
              createdDate: user.createdDate
            };
          })
        };

        this.userReportSubject.next(report);
      });
    });
  }

  getTicketReport(): Observable<TicketReport | null> {
    return this.ticketReport$;
  }

  getGroupReport(): Observable<GroupReport | null> {
    return this.groupReport$;
  }

  getUserReport(): Observable<UserReport | null> {
    return this.userReport$;
  }

  refreshAllReports(): void {
    this.generateTicketReport();
    this.generateGroupReport();
    this.generateUserReport();
  }

  getTicketsByPriority(priority: string): Observable<Ticket[]> {
    return new Observable(observer => {
      this.ticketService.getTickets().subscribe(tickets => {
        const filtered = tickets.filter(t => t.priority?.toLowerCase() === priority.toLowerCase());
        observer.next(filtered);
      });
    });
  }

  getTicketsByGroup(groupId: string): Observable<Ticket[]> {
    return new Observable(observer => {
      this.ticketService.getTickets().subscribe(tickets => {
        const filtered = tickets.filter(t => t.groupId === groupId);
        observer.next(filtered);
      });
    });
  }

  getTicketsByStatus(status: string): Observable<Ticket[]> {
    return new Observable(observer => {
      this.ticketService.getTickets().subscribe(tickets => {
        const filtered = tickets.filter(t => t.status.toLowerCase() === status.toLowerCase());
        observer.next(filtered);
      });
    });
  }

  getTicketsByAssignee(assignee: string): Observable<Ticket[]> {
    return new Observable(observer => {
      this.ticketService.getTickets().subscribe(tickets => {
        const filtered = tickets.filter(t => t.assignedTo === assignee);
        observer.next(filtered);
      });
    });
  }
}
