import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService, Group } from '../../services/group.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.css']
})
export class TicketCreateComponent implements OnInit {
  createForm: FormGroup;
  priorities: Ticket['priority'][] = ['1 - Urgente', '2 - Alta', '3 - Media', '4 - Baja'];
  statuses = ['Pendiente', 'En progreso', 'Revisión', 'Hecho'];

  groupId: string | null = null;
  currentGroupName: string | null = null;
  groupExists: boolean = false;
  userCanCreate: boolean = false;
  errorMessage: string = '';

  availableGroups: Group[] = [];
  selectedGroupId: string | null = null; // in case user chooses manually

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private groupService: GroupService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['Pendiente'],
      assignedTo: [''],
      priority: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // read and decode group name from route (may be URL-encoded)
    const raw = this.route.snapshot.paramMap.get('id');
    this.groupId = raw ? decodeURIComponent(raw) : null;

    // load groups and determine available ones for the user
    this.groupService.getGroups().subscribe(groups => {
      const current = this.userService.getCurrentUser();
      if (current) {
        // super admin sees everything, otherwise only groups they're in
        this.availableGroups = groups.filter(g =>
          this.userService.isSuperAdmin(current.id) || current.groups.includes(g.id)
        );
      } else {
        this.availableGroups = [];
      }

      // once we have groups, validate current id if any
      this.validateGroup();
    });
  }

  private validateGroup(): void {
    if (!this.groupId) {
      this.errorMessage = 'No se especificó un grupo. Selecciona uno de la lista.';
      this.groupExists = false;
      return;
    }

    const group = this.groupService.getGroupById(this.groupId);
    if (!group) {
      this.errorMessage = `El grupo \"${this.groupId}\" no existe.`;
      this.groupExists = false;
      return;
    }

    this.groupExists = true;
    this.currentGroupName = group.name;

    // check membership: only members or superadmin can create
    this.userCanCreate = this.userService.isMemberOfGroup(this.groupId);
    if (!this.userCanCreate) {
      this.errorMessage =
        'No perteneces a este grupo. Solo los miembros del grupo pueden crear tickets.';
    } else {
      this.errorMessage = '';
    }
  }

  createTicket(): void {
    // Validate group exists and membership before creating ticket
    if (!this.groupExists || !this.groupId) {
      this.errorMessage = 'No se puede crear un ticket sin un grupo válido.';
      return;
    }
    if (!this.userCanCreate) {
      this.errorMessage =
        'No tienes permiso para crear tickets en este grupo.';
      return;
    }

    if (this.createForm.valid) {
      const current = this.userService.getCurrentUser();
      const creatorName = current ? (current.username || current.firstName) : '';
      const assignedDefault = this.createForm.value.assignedTo || (current ? current.firstName : '');
      const newTicket: Ticket = {
        id: Date.now().toString(),
        title: this.createForm.value.title,
        description: this.createForm.value.description,
        status: this.createForm.value.status,
        assignedTo: assignedDefault,
        priority: this.createForm.value.priority,
        createdDate: new Date(),
        creator: creatorName,
        comments: [],
        history: [],
        groupId: this.groupId
      };
      this.ticketService.addTicket(newTicket);
      // Navigate to ticket detail
      this.router.navigate(['/group', this.groupId, 'ticket', newTicket.id]);
    }
  }

  cancel(): void {
    // navigate back to group overview, encoding name if needed
    if (this.groupId) {
      this.router.navigate(['/group', encodeURIComponent(this.groupId)]);
    } else {
      this.router.navigate(['/']);
    }
  }

  selectGroup(id: string) {
    this.groupId = id;
    this.validateGroup();
  }
}