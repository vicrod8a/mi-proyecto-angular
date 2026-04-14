import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ticket, HistoryEntry } from '../models/ticket.model';
import { UserService } from './user.service';
import { getAuthToken } from './token.storage';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly STORAGE_KEY = 'mi-proyecto-tickets';
  // additionally track tickets created in this session or by user
  private readonly CREATED_KEY = 'mi-proyecto-created-tickets';

  constructor(private userService: UserService) {
    // attempt to initialize from backend when auth token available
    this.initFromServer().catch(() => {});
  }

  // Normalize various backend response shapes into an array of items
  private extractArray(body: any): any[] {
    if (!body) return [];
    if (Array.isArray(body)) return body;
    if (Array.isArray(body.data)) return body.data;
    // handle gateway wrapper where body.data may itself contain a data array
    if (body.data && Array.isArray(body.data.data)) return body.data.data;
    if (Array.isArray(body.items)) return body.items;
    if (Array.isArray(body.value)) return body.value;
    if (body.data && Array.isArray(body.data.tickets)) return body.data.tickets;
    if (body.data && body.data.data && Array.isArray(body.data.data.tickets)) return body.data.data.tickets;
    if (body && Array.isArray(body.permissions)) return body.permissions;
    return [];
  }

  // Unwrap nested gateway/service envelopes to reach the raw ticket object
  private unwrapBody<T = any>(body: any): T | null {
    if (!body) return null;
    let b: any = body;
    // unwrap common gateway wrapper { statusCode, intOpCode, data }
    if (b && typeof b === 'object' && (b.statusCode || b.intOpCode) && Object.prototype.hasOwnProperty.call(b, 'data')) b = b.data;
    // unwrap public API wrapper { success, data }
    if (b && typeof b === 'object' && Object.prototype.hasOwnProperty.call(b, 'success') && Object.prototype.hasOwnProperty.call(b, 'data')) b = b.data;
    // sometimes services wrap an inner { data: {...} } again
    if (b && typeof b === 'object' && Object.prototype.hasOwnProperty.call(b, 'data') && (b.data && (b.data.id || b.data.title))) b = b.data;
    // if still wrapped in a nested layer like { data: { success: true, data: {...} } }
    if (b && typeof b === 'object' && Object.prototype.hasOwnProperty.call(b, 'data') && typeof b.data === 'object' && Object.keys(b.data).length === 1 && (b.data.data || b.data.items)) {
      b = b.data.data || b.data.items || b.data;
    }
    // final guard: if it's an object that itself contains { success, data }
    if (b && typeof b === 'object' && Object.prototype.hasOwnProperty.call(b, 'success') && Object.prototype.hasOwnProperty.call(b, 'data')) return this.unwrapBody(b);
    return b as T;
  }

  private async resolveNames(t: any) {
    try {
      const creatorId = t.creator_user_id ? String(t.creator_user_id) : null;
      const assigneeId = t.assignee_user_id ? String(t.assignee_user_id) : null;
      let creatorName = '';
      let assigneeName = '';
      if (creatorId) {
        const u = await this.userService.fetchUserById(creatorId);
        if (u) creatorName = u.firstName || u.username || '';
      }
      if (assigneeId) {
        const u2 = await this.userService.fetchUserById(assigneeId);
        if (u2) assigneeName = u2.firstName || u2.username || '';
      }
      return { assignedTo: assigneeName, creator: creatorName, assigneeId: assigneeId, creatorId: creatorId };
    } catch (e) {
      return { assignedTo: t.assignee_user_id ? String(t.assignee_user_id) : '', creator: t.creator_user_id ? String(t.creator_user_id) : '', assigneeId: t.assignee_user_id ? String(t.assignee_user_id) : undefined, creatorId: t.creator_user_id ? String(t.creator_user_id) : undefined };
    }
  }

  private mapStatus(raw: any): Ticket['status'] {
    if (!raw) return 'Pendiente';
    const s = String(raw).toLowerCase();
    if (s === 'new' || s === 'pending' || s === 'pendiente') return 'Pendiente';
    if (s === 'in_progress' || s === 'in-progress' || s === 'in progress' || s === 'en progreso') return 'En progreso';
    if (s === 'review' || s === 'in_review' || s === 'revision' || s === 'revisión') return 'Revisión';
    if (s === 'done' || s === 'completed' || s === 'hecho') return 'Hecho';
    return 'Pendiente';
  }

  // Try to load from server if auth token is present
  async initFromServer(): Promise<void> {
    const token = getAuthToken() || localStorage.getItem('supabase.auth.token');
    if (!token) return;
    try {
      // Route ticket API calls through API Gateway
      const API_BASE = 'http://127.0.0.1:3000';
      const res = await fetch(`${API_BASE}/tickets`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) return;
      const body = await res.json();
      const data = this.extractArray(body);
      const converted: Ticket[] = [];
      for (const t of (data || [])) {
        const names = await this.resolveNames(t);
        converted.push({
          ...t,
          id: String(t.id),
          groupId: String(t.group_id),
          status: this.mapStatus(t.status),
          createdDate: t.created_at ? new Date(t.created_at) : new Date(),
          deadline: t.due_date ? new Date(t.due_date) : undefined,
          assignedTo: names.assignedTo,
          assigneeId: names.assigneeId,
          creator: names.creator,
          creatorId: names.creatorId
        } as Ticket);
      }
      // Merge server-returned tickets with locally-created tickets that are not present on server
      try {
        const localCreated = this.createdSubject.value || [];
        // build set of server ids (stringified)
        const serverIds = new Set((converted || []).map(t => String(t.id)));
        // keep local-only tickets that are not present on server (no matching id)
        const localsToKeep = localCreated.filter(t => !t.id || !serverIds.has(String(t.id)));
        // Union while preserving server ordering and avoiding duplicates
        const unionById: Ticket[] = [];
        const seen = new Set<string>();
        for (const s of (converted || [])) {
          const sid = String(s.id);
          if (seen.has(sid)) continue;
          seen.add(sid);
          unionById.push(s);
        }
        for (const l of localsToKeep) {
          const lid = l && l.id ? String(l.id) : `local-${Math.random().toString(36).slice(2,9)}`;
          if (seen.has(lid)) continue;
          seen.add(lid);
          unionById.push(l);
        }
        this.ticketsSubject.next(unionById);
        this.saveTicketsToStorage(unionById);
      } catch (e) {
        // fallback to server list only
        this.ticketsSubject.next(converted);
        this.saveTicketsToStorage(converted);
      }
    } catch (e) {
      console.warn('[TicketService] Failed to load tickets from server', e);
    }
  }

  private ticketsSubject = new BehaviorSubject<Ticket[]>(this.loadTicketsFromStorage());
  public tickets$ = this.ticketsSubject.asObservable();

  private createdSubject = new BehaviorSubject<Ticket[]>(this.loadCreatedFromStorage());
  public created$ = this.createdSubject.asObservable();

  private loadTicketsFromStorage(): Ticket[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const tickets = JSON.parse(stored);
        // Convert date strings back to Date objects
        const converted = tickets.map((t: any) => ({
          ...t,
          createdDate: new Date(t.createdDate),
          deadline: t.deadline ? new Date(t.deadline) : undefined
        }));
        console.log('[TicketService] Loaded tickets from localStorage:', converted);
        return converted;
      } catch (e) {
        console.warn('[TicketService] Error parsing stored tickets:', e);
      }
    }
    // No default tickets in frontend; return empty list when nothing in storage
    return [];
  }

  private loadCreatedFromStorage(): Ticket[] {
    const stored = localStorage.getItem(this.CREATED_KEY);
    if (stored) {
      try {
        const tickets = JSON.parse(stored);
        const converted = tickets.map((t: any) => ({
          ...t,
          createdDate: new Date(t.createdDate),
          deadline: t.deadline ? new Date(t.deadline) : undefined
        }));
        console.log('[TicketService] Loaded created tickets:', converted);
        return converted;
      } catch (e) {
        console.warn('[TicketService] Error parsing created tickets:', e);
      }
    }
    return [];
  }

  private saveTicketsToStorage(tickets: Ticket[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tickets));
      console.log('[TicketService] Saved tickets to localStorage');
    } catch (e) {
      console.warn('[TicketService] Error saving tickets to localStorage:', e);
    }
  }

  private saveCreatedToStorage(tickets: Ticket[]): void {
    try {
      localStorage.setItem(this.CREATED_KEY, JSON.stringify(tickets));
      console.log('[TicketService] Saved created tickets to localStorage');
    } catch (e) {
      console.warn('[TicketService] Error saving created tickets:', e);
    }
  }

  private getDefaultTickets(): Ticket[] {
    return [];
  }

  getTickets(): Observable<Ticket[]> {
    return this.tickets$;
  }


  /**
   * Tickets explicitly created during session / by users.
   */
  getCreatedTickets(): Observable<Ticket[]> {
    return this.created$;
  }

  /**
   * Return JSON string representing created tickets (use for download).
   */
  exportCreated(): string {
    return JSON.stringify(this.createdSubject.value, null, 2);
  }

  getTicketsForGroup(groupId: string): Observable<Ticket[]> {
    // Combine server-backed tickets and locally-created tickets so UI shows created items
    return combineLatest([this.tickets$, this.created$]).pipe(
      map(([tickets, created]) => {
        const group = String(groupId);
        const serverForGroup = (tickets || []).filter(t => String(t.groupId) === group);
        const createdForGroup = (created || []).filter(t => !t.groupId || String(t.groupId) === group);
        // dedupe by id (prefer server version)
        const out: Ticket[] = [];
        const seen = new Set<string>();
        for (const s of serverForGroup) {
          const id = String(s.id);
          seen.add(id);
          out.push(s);
        }
        for (const c of createdForGroup) {
          const id = c && c.id ? String(c.id) : `local-${Math.random().toString(36).slice(2,9)}`;
          if (seen.has(id)) continue;
          seen.add(id);
          out.push(c as Ticket);
        }
        return out;
      })
    );
  }

  /**
   * Fetch tickets for a specific group from the server and update local store.
   * Used when viewing a group's dashboard to ensure we load group-scoped tickets.
   */
  async fetchTicketsForGroup(groupId: string): Promise<void> {
    const token = getAuthToken() || localStorage.getItem('supabase.auth.token');
    if (!token) {
      console.debug('[TicketService] No auth token; using local tickets only for group', groupId);
      try {
        const localCreated = this.createdSubject.value || [];
        const localForGroup = localCreated.filter(t => {
          try {
            if (!t) return false;
            if (!t.groupId) return true;
            return String(t.groupId) === String(groupId);
          } catch (e) {
            return false;
          }
        });
        const localsToKeep = localForGroup.filter(t => !t.id);
        const unionById: Ticket[] = [];
        const seen = new Set<string>();
        for (const l of localsToKeep) {
          const lid = l && l.id ? String(l.id) : `local-${Math.random().toString(36).slice(2,9)}`;
          if (seen.has(lid)) continue;
          seen.add(lid);
          unionById.push(l);
        }
        // also include any previously stored tickets that match the group
        const stored = (this.ticketsSubject.value || []).filter(t => String(t.groupId) === String(groupId));
        for (const s of stored) {
          const sid = String(s.id);
          if (seen.has(sid)) continue;
          seen.add(sid);
          unionById.unshift(s);
        }
        this.ticketsSubject.next(unionById);
        this.saveTicketsToStorage(unionById);
      } catch (e) {
        console.warn('[TicketService] Token-missing fallback failed', e);
      }
      return;
    }
    try {
      // Route ticket API calls through API Gateway
      const API_BASE = 'http://127.0.0.1:3000';
      if (!groupId) {
        console.warn('[TicketService] fetchTicketsForGroup called with empty groupId');
        return;
      }
      const res = await fetch(`${API_BASE}/tickets?groupId=${encodeURIComponent(groupId)}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) return;
      const body = await res.json();
      const data = this.extractArray(body);
      const converted: Ticket[] = [];
      for (const t of (data || [])) {
        const names = await this.resolveNames(t);
        converted.push({
          ...t,
          id: String(t.id),
          groupId: String(t.group_id),
          status: this.mapStatus(t.status),
          createdDate: t.created_at ? new Date(t.created_at) : new Date(),
          deadline: t.due_date ? new Date(t.due_date) : undefined,
          assignedTo: names.assignedTo,
          assigneeId: names.assigneeId,
          creator: names.creator,
          creatorId: names.creatorId
        } as Ticket);
      }
      console.debug('[TicketService] fetchTicketsForGroup converted:', converted);
      // Merge server-returned tickets with locally-created tickets for this group
      try {
        const localCreated = this.createdSubject.value || [];
        // include local-created tickets that either belong to this group (loose equality)
        // or that don't have a groupId set (to avoid losing user-created drafts)
        const localForGroup = localCreated.filter(t => {
          try {
            if (!t) return false;
            if (!t.groupId) return true; // include unscoped local tickets
            return String(t.groupId) === String(groupId);
          } catch (e) {
            return false;
          }
        });
        const serverIds = new Set((converted || []).map(t => String(t.id)));
        console.debug('[TicketService] localCreated for group:', localCreated.map(l=>({id: String(l.id), groupId: l.groupId || null})));
        console.debug('[TicketService] serverIds:', Array.from(serverIds));
        const localsToKeep = localForGroup.filter(t => !t.id || !serverIds.has(String(t.id)));
        console.debug('[TicketService] localsToKeep:', localsToKeep.map(l=>({id: String(l.id), groupId: l.groupId || null}))); 
        // build union deduped by id
        const unionById: Ticket[] = [];
        const seen = new Set<string>();
        for (const s of (converted || [])) {
          const sid = String(s.id);
          if (seen.has(sid)) continue;
          seen.add(sid);
          unionById.push(s);
        }
        for (const l of localsToKeep) {
          const lid = l && l.id ? String(l.id) : `local-${Math.random().toString(36).slice(2,9)}`;
          if (seen.has(lid)) continue;
          seen.add(lid);
          unionById.push(l);
        }
        this.ticketsSubject.next(unionById);
        this.saveTicketsToStorage(unionById);
      } catch (e) {
        // fallback to server list only
        this.ticketsSubject.next(converted);
        this.saveTicketsToStorage(converted);
      }
    } catch (e) {
      console.warn('[TicketService] fetchTicketsForGroup failed', e);
    }
  }

  /**
   * Fetch a single ticket by id from server and return converted Ticket.
   * Also merges the ticket into the in-memory tickets list.
   */
  async getTicketById(id: string): Promise<Ticket | null> {
    const token = getAuthToken() || localStorage.getItem('supabase.auth.token');
    if (!token) return null;
    try {
      // Route ticket API calls through API Gateway
      const API_BASE = 'http://127.0.0.1:3000';
      const res = await fetch(`${API_BASE}/tickets/${encodeURIComponent(id)}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) return null;
      const body = await res.json();
      const t = this.unwrapBody<any>(body) || body;
      if (!t) return null;
      const names = await this.resolveNames(t);
      const converted = { ...t, id: String(t.id), groupId: String(t.group_id), status: this.mapStatus(t.status), createdDate: t.created_at ? new Date(t.created_at) : new Date(), deadline: t.due_date ? new Date(t.due_date) : undefined, assignedTo: names.assignedTo, assigneeId: names.assigneeId, creator: names.creator, creatorId: names.creatorId } as Ticket;
      // parse history if present
      const rawHistory = body?.history || [];
      converted.history = converted.history || [];
      for (const h of rawHistory) {
        let parsed: any = null;
        try { parsed = JSON.parse(h.detail); } catch (e) { parsed = null; }
        const editorName = h.editor_name || h.editor_name || '';
        const entry: HistoryEntry = {
          id: String(h.id),
          user: String(h.user_id || ''),
          action: h.action || (parsed && parsed.changedFields ? `Updated ${parsed.changedFields.join(',')}` : 'Updated'),
          date: h.created_at ? new Date(h.created_at) : new Date(),
          before: parsed?.before || undefined,
          after: parsed?.after || undefined,
          editorName: editorName
        } as HistoryEntry;
        // also fill oldValue/newValue for backward display when detail is single-field
        if (!entry.before && parsed && parsed.field) {
          entry.field = parsed.field;
          entry.oldValue = parsed.old !== undefined ? String(parsed.old) : undefined;
          entry.newValue = parsed.new !== undefined ? String(parsed.new) : undefined;
        }
        converted.history.push(entry);
      }
      // merge into ticketsSubject if not present
      const tickets = this.ticketsSubject.value.slice();
      const idx = tickets.findIndex(x => String(x.id) === String(converted.id));
      if (idx > -1) tickets[idx] = converted; else tickets.unshift(converted);
      this.ticketsSubject.next(tickets);
      return converted;
    } catch (e) {
      console.warn('[TicketService] getTicketById failed', e);
      return null;
    }
  }

  updateTicket(ticket: Ticket): void {
    const token = getAuthToken() || localStorage.getItem('supabase.auth.token');
    if (token) {
      const assignedToValue = (ticket.assigneeId && String(ticket.assigneeId).trim()) || (ticket.assignedTo ? String(ticket.assignedTo).trim() : '');
      const assigned_to_payload = (/^\d+$/.test(assignedToValue) ? assignedToValue : null);
      // map frontend status to backend token
      const statusMap: any = { 'Pendiente': 'new', 'En progreso': 'in_progress', 'Revisión': 'review', 'Hecho': 'done' };
      const normalizeDeadline = (d: any) => {
        if (!d) return null;
        if (d instanceof Date) return d.toISOString();
        if (typeof d === 'string') {
          // accept YYYY-MM-DD or full ISO
          if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return new Date(d + 'T00:00:00Z').toISOString();
          try { const parsed = new Date(d); if (!isNaN(parsed.getTime())) return parsed.toISOString(); } catch (e) {}
        }
        return d;
      };

      const bodyPayload: any = {
        title: ticket.title,
        description: ticket.description,
        assigned_to: assigned_to_payload,
        priority: ticket.priority,
        deadline: normalizeDeadline(ticket.deadline),
        status: statusMap[ticket.status] || 'new'
      };

      // Route ticket API calls through API Gateway
      const API_BASE = 'http://127.0.0.1:3000';
      fetch(`${API_BASE}/tickets/${encodeURIComponent(ticket.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(bodyPayload)
      }).then(async res => {
        if (!res.ok) throw new Error('Server error');
        const body = await res.json();
        const t = this.unwrapBody<any>(body) || body;
        const names = await this.resolveNames(t);
        const converted = { ...t, id: String(t.id), groupId: String(t.group_id), status: this.mapStatus(t.status), createdDate: t.created_at ? new Date(t.created_at) : new Date(), deadline: t.due_date ? new Date(t.due_date) : undefined, assignedTo: names.assignedTo, assigneeId: names.assigneeId, creator: names.creator, creatorId: names.creatorId } as Ticket;
        // attach history entries returned by server (if any)
        try {
          const hist = body?.history || [];
          converted.history = converted.history || [];
          for (const h of hist) {
            let parsedDetail: any = null;
            try { parsedDetail = JSON.parse(h.detail); } catch (e) { parsedDetail = null; }
            const entry: HistoryEntry = {
              id: String(h.id),
              user: String(h.user_id || h.user || ''),
              action: h.action || parsedDetail?.action || `Changed ${parsedDetail?.field || ''}`,
              field: parsedDetail?.field || undefined,
              oldValue: parsedDetail?.old !== undefined ? String(parsedDetail.old) : undefined,
              newValue: parsedDetail?.new !== undefined ? String(parsedDetail.new) : undefined,
              date: h.created_at ? new Date(h.created_at) : new Date()
            };
            converted.history.push(entry);
          }
        } catch (e) {
          // ignore history parse errors
        }
        const tickets = this.ticketsSubject.value.map(x => x.id === converted.id ? converted : x);
        this.ticketsSubject.next(tickets);
        // Ensure we have the authoritative ticket (with full history and canonical fields)
        // by fetching the ticket again from the server. Do not block the UI.
        try {
          this.getTicketById(converted.id).catch(() => {});
        } catch (e) {
          // ignore
        }
      }).catch(e => console.warn('[TicketService] Failed to update ticket on server', e));
      return;
    }

    const tickets = this.ticketsSubject.value;
    const index = tickets.findIndex(t => t.id === ticket.id);
    if (index !== -1) {
      // Registrar cambios automáticamente
      const oldTicket = tickets[index];
      this.trackChanges(ticket, oldTicket);
      tickets[index] = ticket;
      this.saveTicketsToStorage(tickets);
      this.ticketsSubject.next([...tickets]);
    }
  }

  /**
   * Registra automáticamente los cambios entre el ticket antiguo y el nuevo
   */
  private trackChanges(newTicket: Ticket, oldTicket: Ticket): void {
    const currentUser = this.getCurrentUserName();
    const fieldsToCheck: (keyof Ticket)[] = ['title', 'description', 'status', 'assignedTo', 'priority', 'deadline'];

    fieldsToCheck.forEach(field => {
      const oldValue = oldTicket[field];
      const newValue = newTicket[field];

      // Solo registrar si hubo cambio
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        const entry: HistoryEntry = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          user: currentUser,
          action: `Changed ${field}`,
          field: field,
          oldValue: this.formatValue(oldValue),
          newValue: this.formatValue(newValue),
          date: new Date()
        };
        newTicket.history.push(entry);
      }
    });
  }

  /**
   * Formatea un valor para mostrar en el historial
   */
  private formatValue(value: any): string {
    if (value === null || value === undefined) {
      return '(vacío)';
    }
    if (value instanceof Date) {
      return value.toLocaleDateString('es-ES');
    }
    return String(value);
  }

  async addTicket(ticket: Ticket): Promise<Ticket> {
    const token = getAuthToken() || localStorage.getItem('supabase.auth.token');
    // If token present, create on server
    if (token) {
      try {
        // normalize assigned_to: API expects a user id (numeric/string) or null
        const assignedToValue = (ticket.assigneeId && String(ticket.assigneeId).trim()) || (ticket.assignedTo ? String(ticket.assignedTo).trim() : '');
        const assigned_to_payload = (/^\d+$/.test(assignedToValue) ? assignedToValue : null);
        const normalizeDeadline = (d: any) => {
          if (!d) return null;
          if (d instanceof Date) return d.toISOString();
          if (typeof d === 'string') {
            if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return new Date(d + 'T00:00:00Z').toISOString();
            try { const parsed = new Date(d); if (!isNaN(parsed.getTime())) return parsed.toISOString(); } catch (e) {}
          }
          return d;
        };
        const statusMap: any = { 'Pendiente': 'new', 'En progreso': 'in_progress', 'Revisión': 'review', 'Hecho': 'done' };
        const numericGroupId = ticket.groupId && (/^\d+$/.test(String(ticket.groupId))) ? Number(ticket.groupId) : ticket.groupId;
        const bodyPayload: any = {
          title: ticket.title,
          description: ticket.description,
          group_id: numericGroupId,
          assigned_to: assigned_to_payload,
          priority: ticket.priority,
          deadline: normalizeDeadline(ticket.deadline),
          status: statusMap[(ticket as any).status] || 'new'
        };

        // Route ticket API calls through API Gateway
        const API_BASE = 'http://127.0.0.1:3000';
        const res = await fetch(`${API_BASE}/tickets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(bodyPayload)
        });
        if (!res.ok) throw new Error('Server error');
        const body = await res.json();
        const t = this.unwrapBody<any>(body) || body;
        const names = await this.resolveNames(t);
        const converted = { ...t, id: String(t.id), groupId: String(t.group_id), status: this.mapStatus(t.status), createdDate: t.created_at ? new Date(t.created_at) : new Date(), deadline: t.due_date ? new Date(t.due_date) : undefined, assignedTo: names.assignedTo, assigneeId: names.assigneeId, creator: names.creator, creatorId: names.creatorId } as Ticket;
        const tickets = this.ticketsSubject.value;
        this.ticketsSubject.next([converted, ...tickets]);
        // created list
        const created = this.createdSubject.value;
        this.createdSubject.next([converted, ...created]);
        return converted;
      } catch (e) {
        console.warn('[TicketService] Failed to create ticket on server, falling back to local', e);
        const tickets = this.ticketsSubject.value;
        tickets.push(ticket);
        this.saveTicketsToStorage(tickets);
        this.ticketsSubject.next([...tickets]);
        const created = this.createdSubject.value;
        created.push(ticket);
        this.saveCreatedToStorage(created);
        this.createdSubject.next([...created]);
        return ticket;
      }
    }
    // local fallback
    const tickets = this.ticketsSubject.value;
    tickets.push(ticket);
    this.saveTicketsToStorage(tickets);
    this.ticketsSubject.next([...tickets]);

    // also track created list
    const created = this.createdSubject.value;
    created.push(ticket);
    this.saveCreatedToStorage(created);
    this.createdSubject.next([...created]);
    return ticket;
  }

  deleteTicket(id: string): void {
    const token = getAuthToken() || localStorage.getItem('supabase.auth.token');
    if (token) {
      const API_BASE = 'http://127.0.0.1:3000';
      fetch(`${API_BASE}/tickets/${encodeURIComponent(id)}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }).then(res => {
        if (res.ok) {
          const tickets = this.ticketsSubject.value.filter(t => t.id !== id);
          this.ticketsSubject.next(tickets);
          const created = this.createdSubject.value.filter(t => t.id !== id);
          this.createdSubject.next(created);
        }
      }).catch(e => console.warn('[TicketService] Failed to delete ticket on server', e));
      return;
    }
    const tickets = this.ticketsSubject.value.filter(t => t.id !== id);
    this.saveTicketsToStorage(tickets);
    this.ticketsSubject.next(tickets);

    // also remove from created list if present
    const created = this.createdSubject.value.filter(t => t.id !== id);
    this.saveCreatedToStorage(created);
    this.createdSubject.next(created);
  }

  /**
   * Decide whether current user may delete given ticket.
   * Super admins can delete anything; otherwise only creator may remove.
   */
  canDelete(ticket: Ticket): boolean {
    const current = this.userService.getCurrentUser();
    if (!current) {
      return false;
    }
    // super admin always allowed
    if ((current.permissions || []).includes('system.admin')) {
      return true;
    }
    // check creator matches username or firstName (backwards compatibility)
    return ticket.creator === current.username || ticket.creator === current.firstName;
  }

  /**
   * Decide whether current user may edit given ticket.
   * Super admins can edit anything; otherwise only creator may edit.
   */
  canEdit(ticket: Ticket): boolean {
    const current = this.userService.getCurrentUser();
    if (!current) {
      return false;
    }
    // super admin always allowed
    if ((current.permissions || []).includes('system.admin')) {
      return true;
    }
    // check creator matches username or firstName (backwards compatibility)
    return ticket.creator === current.username || ticket.creator === current.firstName;
  }

  /**
   * Get the current user's display name
   */
  getCurrentUserName(): string {
    const current = this.userService.getCurrentUser();
    return current?.firstName || current?.username || 'Admin';
  }
}