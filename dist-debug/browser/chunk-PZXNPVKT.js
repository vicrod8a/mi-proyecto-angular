import {
  ConfirmDialog,
  ConfirmDialogModule,
  DialogModule
} from "./chunk-VY3M55PE.js";
import {
  DefaultValueAccessor,
  FormsModule,
  InputText,
  InputTextModule,
  NgControlStatus,
  NgModel,
  Toast,
  ToastModule
} from "./chunk-7DWSOU2V.js";
import "./chunk-WWG27WRZ.js";
import {
  Card,
  CardModule,
  SidebarComponent,
  SidebarService
} from "./chunk-LQ6ABAKB.js";
import {
  Button,
  ButtonModule
} from "./chunk-HWDZGNHS.js";
import {
  ConfirmationService,
  MessageService
} from "./chunk-JNXR6VHA.js";
import {
  AsyncPipe,
  BehaviorSubject,
  CommonModule,
  Component,
  DatePipe,
  Injectable,
  NgIf,
  Router,
  RouterModule,
  __spreadValues,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ANLN36LO.js";

// src/app/services/profile.service.ts
var ProfileService = class _ProfileService {
  currentUser = {
    id: 1,
    firstName: "Juan",
    lastName: "P\xE9rez",
    email: "juan.perez@example.com",
    phone: "+34 666 777 888",
    bio: "Desarrollador Full Stack apasionado por la tecnolog\xEDa y la innovaci\xF3n.",
    avatar: "https://via.placeholder.com/200",
    joinDate: "2024-01-15"
  };
  userSubject = new BehaviorSubject(this.currentUser);
  user$ = this.userSubject.asObservable();
  constructor() {
  }
  getUser() {
    return this.user$;
  }
  updateUser(user) {
    this.currentUser = __spreadValues(__spreadValues({}, this.currentUser), user);
    this.userSubject.next(this.currentUser);
  }
  deleteUser() {
    console.log("Usuario eliminado");
  }
  getCurrentUser() {
    return this.currentUser;
  }
  static \u0275fac = function ProfileService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProfileService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ProfileService, factory: _ProfileService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfileService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// src/app/pages/profile/profile.component.ts
function ProfileComponent_div_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 29)(1, "div", 30)(2, "label");
    \u0275\u0275text(3, "Nombre:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 30)(7, "label");
    \u0275\u0275text(8, "Apellido:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 30)(12, "label");
    \u0275\u0275text(13, "Email:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 30)(17, "label");
    \u0275\u0275text(18, "Tel\xE9fono:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span");
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 30)(22, "label");
    \u0275\u0275text(23, "Biograf\xEDa:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span");
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 31)(27, "p-button", 32);
    \u0275\u0275listener("onClick", function ProfileComponent_div_23_Template_p_button_onClick_27_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleEdit());
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.user.firstName);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.user.lastName);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.user.email);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.user.phone);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.user.bio);
  }
}
function ProfileComponent_div_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 33)(1, "div", 34)(2, "label", 35);
    \u0275\u0275text(3, "Nombre *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 36);
    \u0275\u0275twoWayListener("ngModelChange", function ProfileComponent_div_24_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.editingUser.firstName, $event) || (ctx_r1.editingUser.firstName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 34)(6, "label", 37);
    \u0275\u0275text(7, "Apellido *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "input", 38);
    \u0275\u0275twoWayListener("ngModelChange", function ProfileComponent_div_24_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.editingUser.lastName, $event) || (ctx_r1.editingUser.lastName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 34)(10, "label", 39);
    \u0275\u0275text(11, "Email *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "input", 40);
    \u0275\u0275twoWayListener("ngModelChange", function ProfileComponent_div_24_Template_input_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.editingUser.email, $event) || (ctx_r1.editingUser.email = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 34)(14, "label", 41);
    \u0275\u0275text(15, "Tel\xE9fono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "input", 42);
    \u0275\u0275twoWayListener("ngModelChange", function ProfileComponent_div_24_Template_input_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.editingUser.phone, $event) || (ctx_r1.editingUser.phone = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 34)(18, "label", 43);
    \u0275\u0275text(19, "Biograf\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "textarea", 44);
    \u0275\u0275twoWayListener("ngModelChange", function ProfileComponent_div_24_Template_textarea_ngModelChange_20_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.editingUser.bio, $event) || (ctx_r1.editingUser.bio = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275text(21, "          ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 31)(23, "p-button", 45);
    \u0275\u0275listener("onClick", function ProfileComponent_div_24_Template_p_button_onClick_23_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveProfile());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "p-button", 46);
    \u0275\u0275listener("onClick", function ProfileComponent_div_24_Template_p_button_onClick_24_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cancelEdit());
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.editingUser.firstName);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.editingUser.lastName);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.editingUser.email);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.editingUser.phone);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.editingUser.bio);
  }
}
var ProfileComponent = class _ProfileComponent {
  sidebarService;
  profileService;
  messageService;
  confirmationService;
  router;
  isEditing = false;
  user;
  editingUser;
  constructor(sidebarService, profileService, messageService, confirmationService, router) {
    this.sidebarService = sidebarService;
    this.profileService = profileService;
    this.messageService = messageService;
    this.confirmationService = confirmationService;
    this.router = router;
    this.user = this.profileService.getCurrentUser();
    this.editingUser = __spreadValues({}, this.user);
  }
  ngOnInit() {
    this.profileService.user$.subscribe((user) => {
      this.user = user;
    });
  }
  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
  toggleEdit() {
    if (this.isEditing) {
      this.editingUser = __spreadValues({}, this.user);
      this.isEditing = false;
    } else {
      this.editingUser = __spreadValues({}, this.user);
      this.isEditing = true;
    }
  }
  saveProfile() {
    if (!this.editingUser.firstName || !this.editingUser.lastName || !this.editingUser.email) {
      this.messageService.add({
        severity: "warn",
        summary: "Campos inv\xE1lidos",
        detail: "Por favor completa todos los campos obligatorios"
      });
      return;
    }
    this.profileService.updateUser(this.editingUser);
    this.user = __spreadValues({}, this.editingUser);
    this.isEditing = false;
    this.messageService.add({
      severity: "success",
      summary: "\xC9xito",
      detail: "Perfil actualizado correctamente"
    });
  }
  cancelEdit() {
    this.editingUser = __spreadValues({}, this.user);
    this.isEditing = false;
  }
  deleteAccount() {
    this.confirmationService.confirm({
      message: "\xBFEst\xE1s seguro de que deseas eliminar tu cuenta? Esta acci\xF3n no se puede deshacer.",
      header: "Confirmar eliminaci\xF3n de cuenta",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.profileService.deleteUser();
        this.messageService.add({
          severity: "success",
          summary: "\xC9xito",
          detail: "Cuenta eliminada correctamente"
        });
        setTimeout(() => {
          this.router.navigate(["/login"]);
        }, 2e3);
      }
    });
  }
  static \u0275fac = function ProfileComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProfileComponent)(\u0275\u0275directiveInject(SidebarService), \u0275\u0275directiveInject(ProfileService), \u0275\u0275directiveInject(MessageService), \u0275\u0275directiveInject(ConfirmationService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProfileComponent, selectors: [["app-profile"]], features: [\u0275\u0275ProvidersFeature([MessageService, ConfirmationService])], decls: 82, vars: 13, consts: [[1, "content"], [1, "profile-header"], [1, "header-top"], ["title", "Men\xFA", 1, "menu-toggle", 3, "click"], [1, "pi", "pi-bars"], [1, "pi", "pi-user"], [1, "profile-container"], [1, "avatar-section"], ["alt", "Avatar del usuario", 1, "avatar", 3, "src"], [1, "member-since"], ["header", "Informaci\xF3n Personal", 1, "profile-card"], ["class", "profile-info", 4, "ngIf"], ["class", "profile-form", 4, "ngIf"], ["header", "Estad\xEDsticas de Cuenta", 1, "profile-card"], [1, "stats-grid"], [1, "stat-card"], [1, "pi", "pi-check-circle"], [1, "pi", "pi-comment"], [1, "pi", "pi-flag"], [1, "pi", "pi-star"], ["header", "Configuraci\xF3n de Cuenta", 1, "profile-card"], [1, "settings-list"], [1, "setting-item"], ["label", "Cambiar", "icon", "pi pi-lock", "severity", "secondary"], ["label", "Configurar", "icon", "pi pi-bell", "severity", "secondary"], ["label", "Ajustar", "icon", "pi pi-shield", "severity", "secondary"], ["header", "Zona de Peligro", 1, "profile-card", "danger-card"], [1, "danger-item"], ["label", "Eliminar Cuenta", "icon", "pi pi-trash", "severity", "danger", 3, "onClick"], [1, "profile-info"], [1, "info-row"], [1, "button-group"], ["label", "Editar Perfil", "icon", "pi pi-pencil", "severity", "info", 3, "onClick"], [1, "profile-form"], [1, "form-group"], ["for", "firstName"], ["pInputText", "", "id", "firstName", "type", "text", "placeholder", "Tu nombre", 1, "form-control", 3, "ngModelChange", "ngModel"], ["for", "lastName"], ["pInputText", "", "id", "lastName", "type", "text", "placeholder", "Tu apellido", 1, "form-control", 3, "ngModelChange", "ngModel"], ["for", "email"], ["pInputText", "", "id", "email", "type", "email", "placeholder", "tu.email@ejemplo.com", 1, "form-control", 3, "ngModelChange", "ngModel"], ["for", "phone"], ["pInputText", "", "id", "phone", "type", "tel", "placeholder", "+34 666 777 888", 1, "form-control", 3, "ngModelChange", "ngModel"], ["for", "bio"], ["id", "bio", "placeholder", "Cu\xE9ntanos sobre ti", "rows", "4", 1, "form-textarea", 3, "ngModelChange", "ngModel"], ["label", "Guardar", "icon", "pi pi-check", "severity", "success", 3, "onClick"], ["label", "Cancelar", "icon", "pi pi-times", "severity", "secondary", 3, "onClick"]], template: function ProfileComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-sidebar")(1, "p-toast")(2, "p-confirmDialog");
      \u0275\u0275elementStart(3, "div", 0);
      \u0275\u0275pipe(4, "async");
      \u0275\u0275elementStart(5, "div", 1)(6, "div", 2)(7, "button", 3);
      \u0275\u0275listener("click", function ProfileComponent_Template_button_click_7_listener() {
        return ctx.toggleSidebar();
      });
      \u0275\u0275element(8, "i", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "h1");
      \u0275\u0275element(10, "i", 5);
      \u0275\u0275text(11, " Mi Perfil");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "p");
      \u0275\u0275text(13, "Gestiona tu informaci\xF3n personal");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "div", 6)(15, "div", 7);
      \u0275\u0275element(16, "img", 8);
      \u0275\u0275elementStart(17, "h2");
      \u0275\u0275text(18);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "p", 9);
      \u0275\u0275text(20);
      \u0275\u0275pipe(21, "date");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "p-card", 10);
      \u0275\u0275template(23, ProfileComponent_div_23_Template, 28, 5, "div", 11)(24, ProfileComponent_div_24_Template, 25, 5, "div", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "p-card", 13)(26, "div", 14)(27, "div", 15);
      \u0275\u0275element(28, "i", 16);
      \u0275\u0275elementStart(29, "h4");
      \u0275\u0275text(30, "Actividad");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "p");
      \u0275\u0275text(32, "125 acciones");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(33, "div", 15);
      \u0275\u0275element(34, "i", 17);
      \u0275\u0275elementStart(35, "h4");
      \u0275\u0275text(36, "Comentarios");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "p");
      \u0275\u0275text(38, "48 comentarios");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(39, "div", 15);
      \u0275\u0275element(40, "i", 18);
      \u0275\u0275elementStart(41, "h4");
      \u0275\u0275text(42, "Reportes");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "p");
      \u0275\u0275text(44, "12 reportes");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(45, "div", 15);
      \u0275\u0275element(46, "i", 19);
      \u0275\u0275elementStart(47, "h4");
      \u0275\u0275text(48, "Calificaci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "p");
      \u0275\u0275text(50, "4.8/5.0");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(51, "p-card", 20)(52, "div", 21)(53, "div", 22)(54, "div")(55, "h5");
      \u0275\u0275text(56, "Cambiar Contrase\xF1a");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(57, "p");
      \u0275\u0275text(58, "Actualiza tu contrase\xF1a regularmente para mantener tu cuenta segura");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(59, "p-button", 23);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(60, "div", 22)(61, "div")(62, "h5");
      \u0275\u0275text(63, "Notificaciones");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(64, "p");
      \u0275\u0275text(65, "Gestiona tus preferencias de notificaciones");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(66, "p-button", 24);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(67, "div", 22)(68, "div")(69, "h5");
      \u0275\u0275text(70, "Privacidad");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(71, "p");
      \u0275\u0275text(72, "Controla qui\xE9n puede ver tu perfil");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(73, "p-button", 25);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(74, "p-card", 26)(75, "div", 27)(76, "div")(77, "h5");
      \u0275\u0275text(78, "Eliminar Cuenta");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(79, "p");
      \u0275\u0275text(80, "Elimina permanentemente tu cuenta y todos tus datos asociados. Esta acci\xF3n no se puede deshacer.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(81, "p-button", 28);
      \u0275\u0275listener("onClick", function ProfileComponent_Template_p_button_onClick_81_listener() {
        return ctx.deleteAccount();
      });
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275classProp("sidebar-collapsed", !\u0275\u0275pipeBind1(4, 8, ctx.sidebarService.sidebarVisible$));
      \u0275\u0275advance(13);
      \u0275\u0275property("src", ctx.user.avatar, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate2("", ctx.user.firstName, " ", ctx.user.lastName);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("Miembro desde ", \u0275\u0275pipeBind2(21, 10, ctx.user.joinDate, "dd/MM/yyyy"));
      \u0275\u0275advance(3);
      \u0275\u0275property("ngIf", !ctx.isEditing);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.isEditing);
    }
  }, dependencies: [
    CommonModule,
    NgIf,
    RouterModule,
    SidebarComponent,
    CardModule,
    Card,
    ButtonModule,
    Button,
    InputTextModule,
    InputText,
    FormsModule,
    DefaultValueAccessor,
    NgControlStatus,
    NgModel,
    DialogModule,
    ToastModule,
    Toast,
    ConfirmDialogModule,
    ConfirmDialog,
    AsyncPipe,
    DatePipe
  ], styles: ['\n\n.content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  padding: 30px;\n  background:\n    linear-gradient(\n      135deg,\n      #f5f7fa 0%,\n      #c3cfe2 100%);\n  min-height: 100vh;\n  margin-left: 250px;\n  width: calc(100% - 250px);\n  transition: margin-left 0.3s ease, width 0.3s ease;\n  box-sizing: border-box;\n  overflow-x: hidden;\n}\n.content.sidebar-collapsed[_ngcontent-%COMP%] {\n  margin-left: 70px;\n  width: calc(100% - 70px);\n}\n.profile-header[_ngcontent-%COMP%] {\n  margin-bottom: 40px;\n  padding-bottom: 20px;\n  border-bottom: 3px solid rgba(102, 126, 234, 0.3);\n}\n.header-top[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n  margin-bottom: 15px;\n  flex-wrap: wrap;\n}\n.menu-toggle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  border: none;\n  color: white;\n  width: 50px;\n  height: 50px;\n  border-radius: 12px;\n  font-size: 1.5rem;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.3s ease;\n  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);\n  flex-shrink: 0;\n}\n.menu-toggle[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);\n}\n.menu-toggle[_ngcontent-%COMP%]:active {\n  transform: scale(0.95);\n}\n.profile-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  color: #2c3e50;\n  margin: 0;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  word-break: break-word;\n  font-weight: 700;\n  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);\n}\n.profile-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  color: #667eea;\n}\n.profile-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #666;\n  margin: 10px 0 0 0;\n  word-break: break-word;\n  font-size: 1.1rem;\n}\n.profile-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 25px;\n}\n.avatar-section[_ngcontent-%COMP%] {\n  text-align: center;\n  background: white;\n  padding: 40px 30px;\n  border-radius: 16px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);\n  border: 1px solid rgba(255, 255, 255, 0.5);\n  transition: all 0.3s ease;\n}\n.avatar-section[_ngcontent-%COMP%]:hover {\n  transform: translateY(-5px);\n  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);\n}\n.avatar[_ngcontent-%COMP%] {\n  width: 150px;\n  height: 150px;\n  border-radius: 50%;\n  object-fit: cover;\n  border: 5px solid;\n  border-image:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%) 1;\n  margin-bottom: 20px;\n  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);\n  transition: all 0.3s ease;\n}\n.avatar-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 20px 0 10px;\n  font-size: 1.8em;\n  color: #2c3e50;\n  word-break: break-word;\n  font-weight: 700;\n}\n.member-since[_ngcontent-%COMP%] {\n  color: #999;\n  font-size: 1em;\n  margin: 0;\n}\n.profile-card[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 16px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);\n  padding: 30px !important;\n  border: 1px solid rgba(255, 255, 255, 0.5);\n  transition: all 0.3s ease;\n}\n.profile-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);\n}\n.profile-card[_ngcontent-%COMP%]   .p-card-header[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: white !important;\n  margin: -30px -30px 20px -30px;\n  padding: 20px 30px;\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  border-radius: 16px 16px 0 0;\n}\n.profile-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n.info-row[_ngcontent-%COMP%] {\n  display: flex;\n  padding: 15px 0;\n  border-bottom: 2px solid #f0f0f0;\n  word-break: break-word;\n  transition: all 0.3s ease;\n}\n.info-row[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n.info-row[_ngcontent-%COMP%]:hover {\n  background-color: #f8f9fa;\n  padding-left: 10px;\n  padding-right: 10px;\n  margin-left: -10px;\n  margin-right: -10px;\n}\n.info-row[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-weight: 700;\n  color: #667eea;\n  min-width: 140px;\n  flex-shrink: 0;\n  text-transform: uppercase;\n  font-size: 0.9rem;\n  letter-spacing: 0.5px;\n}\n.info-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #555;\n  flex: 1;\n  word-break: break-word;\n  font-size: 1.05rem;\n}\n.profile-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 25px;\n}\n.form-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-weight: 700;\n  color: #2c3e50;\n  margin-bottom: 8px;\n  text-transform: uppercase;\n  font-size: 0.9rem;\n  letter-spacing: 0.5px;\n}\n.form-control[_ngcontent-%COMP%], \ninput[pInputText][_ngcontent-%COMP%], \ntextarea.form-textarea[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n  border: 2px solid #e0e6ed;\n  border-radius: 8px;\n  font-size: 1em;\n  width: 100%;\n  box-sizing: border-box;\n  transition: all 0.3s ease;\n  background-color: #f8f9fa;\n  font-family:\n    "Segoe UI",\n    Tahoma,\n    Geneva,\n    Verdana,\n    sans-serif;\n}\n.form-control[_ngcontent-%COMP%]:focus, \ninput[pInputText][_ngcontent-%COMP%]:focus, \ntextarea.form-textarea[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #667eea;\n  background-color: white;\n  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);\n}\ntextarea.form-textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n  min-height: 120px;\n  font-family:\n    "Segoe UI",\n    Tahoma,\n    Geneva,\n    Verdana,\n    sans-serif;\n}\n.button-group[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 15px;\n  margin-top: 30px;\n  padding-top: 25px;\n  border-top: 2px solid #f0f0f0;\n  flex-wrap: wrap;\n}\n.button-group[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button) {\n  padding: 12px 24px !important;\n  font-weight: 600;\n  border-radius: 8px !important;\n  transition: all 0.3s ease !important;\n}\n.button-group[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button-success) {\n  background:\n    linear-gradient(\n      135deg,\n      #11998e 0%,\n      #38ef7d 100%) !important;\n  border: none !important;\n}\n.button-group[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button-success:hover) {\n  transform: translateY(-2px) !important;\n  box-shadow: 0 6px 20px rgba(17, 153, 142, 0.4) !important;\n}\n.button-group[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button-secondary) {\n  background-color: #95a5a6 !important;\n  border: none !important;\n}\n.button-group[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button-secondary:hover) {\n  background-color: #7f8c8d !important;\n  transform: translateY(-2px) !important;\n}\n.button-group[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button-info) {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%) !important;\n  border: none !important;\n}\n.button-group[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button-info:hover) {\n  transform: translateY(-2px) !important;\n  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;\n}\n.stats-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 20px;\n  padding: 0;\n}\n.stat-card[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n  padding: 25px 20px;\n  border-radius: 12px;\n  text-align: center;\n  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);\n  transition: all 0.3s ease;\n}\n.stat-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-8px);\n  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5);\n}\n.stat-card[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 2.5em;\n  margin-bottom: 12px;\n  display: block;\n  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);\n}\n.stat-card[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 12px 0 8px;\n  font-size: 1.1em;\n  word-break: break-word;\n  font-weight: 700;\n}\n.stat-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.8em;\n  font-weight: bold;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);\n}\n.settings-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n.setting-item[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px;\n  background:\n    linear-gradient(\n      135deg,\n      #f8f9fa 0%,\n      #fff 100%);\n  border-radius: 12px;\n  border-left: 5px solid #667eea;\n  gap: 20px;\n  transition: all 0.3s ease;\n}\n.setting-item[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #fff 0%,\n      #f8f9fa 100%);\n  transform: translateX(8px);\n  border-left-color: #764ba2;\n  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);\n}\n.setting-item[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%] {\n  margin: 0 0 8px;\n  color: #2c3e50;\n  word-break: break-word;\n  font-weight: 700;\n  font-size: 1.1rem;\n}\n.setting-item[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #666;\n  font-size: 0.95em;\n  word-break: break-word;\n}\n.setting-item[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button) {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%) !important;\n  border: none !important;\n  padding: 10px 18px !important;\n  font-weight: 600;\n  transition: all 0.3s ease !important;\n}\n.setting-item[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button:hover) {\n  transform: translateY(-2px) !important;\n  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;\n}\n.danger-card[_ngcontent-%COMP%] {\n  border: 2px solid #e74c3c !important;\n  background:\n    linear-gradient(\n      135deg,\n      #ffe6e6 0%,\n      #fff 100%) !important;\n  padding: 30px !important;\n}\n.danger-card[_ngcontent-%COMP%]   .p-card-header[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #e74c3c 0%,\n      #c0392b 100%) !important;\n  color: white !important;\n  font-weight: 700;\n  margin: -30px -30px 20px -30px !important;\n  padding: 20px 30px !important;\n}\n.danger-item[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 25px;\n  background:\n    linear-gradient(\n      135deg,\n      #ffebee 0%,\n      #fff 100%);\n  border-radius: 12px;\n  border-left: 5px solid #e74c3c;\n  gap: 20px;\n  transition: all 0.3s ease;\n}\n.danger-item[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #ffcdd2 0%,\n      #ffebee 100%);\n  transform: translateX(8px);\n  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.2);\n}\n.danger-item[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%] {\n  margin: 0 0 8px;\n  color: #c0392b;\n  font-weight: 700;\n  word-break: break-word;\n  font-size: 1.1rem;\n}\n.danger-item[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #e74c3c;\n  font-size: 0.95em;\n  word-break: break-word;\n}\n.danger-item[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button) {\n  background:\n    linear-gradient(\n      135deg,\n      #e74c3c 0%,\n      #c0392b 100%) !important;\n  border: none !important;\n  padding: 10px 18px !important;\n  font-weight: 600;\n  transition: all 0.3s ease !important;\n}\n.danger-item[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button:hover) {\n  transform: translateY(-2px) !important;\n  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4) !important;\n}\n.ml-2[_ngcontent-%COMP%] {\n  margin-left: 10px !important;\n}\n.mt-3[_ngcontent-%COMP%] {\n  margin-top: 15px !important;\n}\n@media (max-width: 1024px) {\n  .content[_ngcontent-%COMP%] {\n    margin-left: 250px;\n    width: calc(100% - 250px);\n  }\n  .profile-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.7rem;\n  }\n  .avatar[_ngcontent-%COMP%] {\n    width: 100px;\n    height: 100px;\n  }\n  .avatar-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    font-size: 1.3em;\n  }\n  .stats-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (max-width: 768px) {\n  .content[_ngcontent-%COMP%] {\n    margin-left: 0;\n    width: 100%;\n    padding: 15px;\n  }\n  .content.sidebar-collapsed[_ngcontent-%COMP%] {\n    margin-left: 0;\n    width: 100%;\n  }\n  .header-top[_ngcontent-%COMP%] {\n    gap: 10px;\n  }\n  .menu-toggle[_ngcontent-%COMP%] {\n    width: 40px;\n    height: 40px;\n    font-size: 1.2rem;\n  }\n  .profile-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.4rem;\n  }\n  .avatar[_ngcontent-%COMP%] {\n    width: 90px;\n    height: 90px;\n  }\n  .avatar-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    font-size: 1.2em;\n  }\n  .avatar-section[_ngcontent-%COMP%] {\n    padding: 20px 15px;\n  }\n  .info-row[_ngcontent-%COMP%] {\n    flex-direction: column;\n    padding: 10px 0;\n  }\n  .info-row[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n    margin-bottom: 5px;\n    min-width: auto;\n  }\n  .setting-item[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .stats-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr);\n    gap: 15px;\n  }\n  .stat-card[_ngcontent-%COMP%] {\n    padding: 15px;\n  }\n  .stat-card[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n    font-size: 1.5em;\n  }\n  .stat-card[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n    font-size: 0.95em;\n  }\n  .stat-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    font-size: 1.2em;\n  }\n}\n@media (max-width: 480px) {\n  .content[_ngcontent-%COMP%] {\n    padding: 10px;\n  }\n  .header-top[_ngcontent-%COMP%] {\n    gap: 8px;\n    margin-bottom: 15px;\n  }\n  .menu-toggle[_ngcontent-%COMP%] {\n    width: 38px;\n    height: 38px;\n    font-size: 1rem;\n  }\n  .profile-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.2rem;\n    gap: 8px;\n  }\n  .profile-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n    font-size: 1.1rem;\n  }\n  .avatar[_ngcontent-%COMP%] {\n    width: 80px;\n    height: 80px;\n    border-width: 3px;\n  }\n  .avatar-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    font-size: 1rem;\n    margin: 10px 0;\n  }\n  .avatar-section[_ngcontent-%COMP%] {\n    padding: 15px 10px;\n  }\n  .profile-container[_ngcontent-%COMP%] {\n    gap: 15px;\n  }\n  .info-row[_ngcontent-%COMP%] {\n    padding: 8px 0;\n    font-size: 0.9rem;\n  }\n  .info-row[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n    font-size: 0.85rem;\n  }\n  .form-control[_ngcontent-%COMP%] {\n    font-size: 16px;\n  }\n  textarea.form-control[_ngcontent-%COMP%] {\n    min-height: 80px;\n  }\n  .stats-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 12px;\n  }\n  .stat-card[_ngcontent-%COMP%] {\n    padding: 12px;\n  }\n  .stat-card[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n    font-size: 1.3em;\n  }\n  .stat-card[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n    font-size: 0.9em;\n    margin: 8px 0 3px;\n  }\n  .stat-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    font-size: 1.1em;\n  }\n  .setting-item[_ngcontent-%COMP%] {\n    padding: 15px;\n    flex-direction: column;\n  }\n  .setting-item[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%] {\n    font-size: 0.95rem;\n  }\n  .setting-item[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    font-size: 0.85rem;\n  }\n  .button-group[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 8px;\n  }\n  .button-group[_ngcontent-%COMP%]   p-button[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=profile.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfileComponent, [{
    type: Component,
    args: [{ selector: "app-profile", standalone: true, imports: [
      CommonModule,
      RouterModule,
      SidebarComponent,
      CardModule,
      ButtonModule,
      InputTextModule,
      FormsModule,
      DialogModule,
      ToastModule,
      ConfirmDialogModule
    ], providers: [MessageService, ConfirmationService], template: `<app-sidebar></app-sidebar>\r
<p-toast></p-toast>\r
<p-confirmDialog></p-confirmDialog>\r
\r
<div class="content" [class.sidebar-collapsed]="!(sidebarService.sidebarVisible$ | async)">\r
  <div class="profile-header">\r
    <div class="header-top">\r
      <button class="menu-toggle" (click)="toggleSidebar()" title="Men\xFA">\r
        <i class="pi pi-bars"></i>\r
      </button>\r
      <h1><i class="pi pi-user"></i> Mi Perfil</h1>\r
    </div>\r
    <p>Gestiona tu informaci\xF3n personal</p>\r
  </div>\r
\r
  <div class="profile-container">\r
    <!-- Avatar Section -->\r
    <div class="avatar-section">\r
      <img [src]="user.avatar" alt="Avatar del usuario" class="avatar">\r
      <h2>{{ user.firstName }} {{ user.lastName }}</h2>\r
      <p class="member-since">Miembro desde {{ user.joinDate | date: 'dd/MM/yyyy' }}</p>\r
    </div>\r
\r
    <!-- Profile Information -->\r
    <p-card header="Informaci\xF3n Personal" class="profile-card">\r
      <div *ngIf="!isEditing" class="profile-info">\r
        <div class="info-row">\r
          <label>Nombre:</label>\r
          <span>{{ user.firstName }}</span>\r
        </div>\r
        <div class="info-row">\r
          <label>Apellido:</label>\r
          <span>{{ user.lastName }}</span>\r
        </div>\r
        <div class="info-row">\r
          <label>Email:</label>\r
          <span>{{ user.email }}</span>\r
        </div>\r
        <div class="info-row">\r
          <label>Tel\xE9fono:</label>\r
          <span>{{ user.phone }}</span>\r
        </div>\r
        <div class="info-row">\r
          <label>Biograf\xEDa:</label>\r
          <span>{{ user.bio }}</span>\r
        </div>\r
\r
        <div class="button-group">\r
          <p-button label="Editar Perfil" icon="pi pi-pencil" (onClick)="toggleEdit()" severity="info"></p-button>\r
        </div>\r
      </div>\r
\r
      <div *ngIf="isEditing" class="profile-form">\r
        <div class="form-group">\r
          <label for="firstName">Nombre *</label>\r
          <input \r
            pInputText \r
            id="firstName" \r
            [(ngModel)]="editingUser.firstName" \r
            type="text" \r
            placeholder="Tu nombre"\r
            class="form-control">\r
        </div>\r
\r
        <div class="form-group">\r
          <label for="lastName">Apellido *</label>\r
          <input \r
            pInputText \r
            id="lastName" \r
            [(ngModel)]="editingUser.lastName" \r
            type="text" \r
            placeholder="Tu apellido"\r
            class="form-control">\r
        </div>\r
\r
        <div class="form-group">\r
          <label for="email">Email *</label>\r
          <input \r
            pInputText \r
            id="email" \r
            [(ngModel)]="editingUser.email" \r
            type="email" \r
            placeholder="tu.email@ejemplo.com"\r
            class="form-control">\r
        </div>\r
\r
        <div class="form-group">\r
          <label for="phone">Tel\xE9fono</label>\r
          <input \r
            pInputText \r
            id="phone" \r
            [(ngModel)]="editingUser.phone" \r
            type="tel" \r
            placeholder="+34 666 777 888"\r
            class="form-control">\r
        </div>\r
\r
        <div class="form-group">\r
          <label for="bio">Biograf\xEDa</label>\r
          <textarea \r
            id="bio" \r
            [(ngModel)]="editingUser.bio" \r
            placeholder="Cu\xE9ntanos sobre ti"\r
            rows="4"\r
            class="form-textarea">\r
          </textarea>\r
        </div>\r
\r
        <div class="button-group">\r
          <p-button \r
            label="Guardar" \r
            icon="pi pi-check" \r
            (onClick)="saveProfile()" \r
            severity="success">\r
          </p-button>\r
          <p-button \r
            label="Cancelar" \r
            icon="pi pi-times" \r
            (onClick)="cancelEdit()" \r
            severity="secondary">\r
          </p-button>\r
        </div>\r
      </div>\r
    </p-card>\r
\r
    <!-- Account Statistics -->\r
    <p-card header="Estad\xEDsticas de Cuenta" class="profile-card">\r
      <div class="stats-grid">\r
        <div class="stat-card">\r
          <i class="pi pi-check-circle"></i>\r
          <h4>Actividad</h4>\r
          <p>125 acciones</p>\r
        </div>\r
        <div class="stat-card">\r
          <i class="pi pi-comment"></i>\r
          <h4>Comentarios</h4>\r
          <p>48 comentarios</p>\r
        </div>\r
        <div class="stat-card">\r
          <i class="pi pi-flag"></i>\r
          <h4>Reportes</h4>\r
          <p>12 reportes</p>\r
        </div>\r
        <div class="stat-card">\r
          <i class="pi pi-star"></i>\r
          <h4>Calificaci\xF3n</h4>\r
          <p>4.8/5.0</p>\r
        </div>\r
      </div>\r
    </p-card>\r
\r
    <!-- Account Settings -->\r
    <p-card header="Configuraci\xF3n de Cuenta" class="profile-card">\r
      <div class="settings-list">\r
        <div class="setting-item">\r
          <div>\r
            <h5>Cambiar Contrase\xF1a</h5>\r
            <p>Actualiza tu contrase\xF1a regularmente para mantener tu cuenta segura</p>\r
          </div>\r
          <p-button label="Cambiar" icon="pi pi-lock" severity="secondary"></p-button>\r
        </div>\r
        <div class="setting-item">\r
          <div>\r
            <h5>Notificaciones</h5>\r
            <p>Gestiona tus preferencias de notificaciones</p>\r
          </div>\r
          <p-button label="Configurar" icon="pi pi-bell" severity="secondary"></p-button>\r
        </div>\r
        <div class="setting-item">\r
          <div>\r
            <h5>Privacidad</h5>\r
            <p>Controla qui\xE9n puede ver tu perfil</p>\r
          </div>\r
          <p-button label="Ajustar" icon="pi pi-shield" severity="secondary"></p-button>\r
        </div>\r
      </div>\r
    </p-card>\r
\r
    <!-- Danger Zone -->\r
    <p-card header="Zona de Peligro" class="profile-card danger-card">\r
      <div class="danger-item">\r
        <div>\r
          <h5>Eliminar Cuenta</h5>\r
          <p>Elimina permanentemente tu cuenta y todos tus datos asociados. Esta acci\xF3n no se puede deshacer.</p>\r
        </div>\r
        <p-button \r
          label="Eliminar Cuenta" \r
          icon="pi pi-trash" \r
          severity="danger"\r
          (onClick)="deleteAccount()">\r
        </p-button>\r
      </div>\r
    </p-card>\r
  </div>\r
</div>\r
`, styles: ['/* src/app/pages/profile/profile.component.css */\n.content {\n  display: flex;\n  flex-direction: column;\n  padding: 30px;\n  background:\n    linear-gradient(\n      135deg,\n      #f5f7fa 0%,\n      #c3cfe2 100%);\n  min-height: 100vh;\n  margin-left: 250px;\n  width: calc(100% - 250px);\n  transition: margin-left 0.3s ease, width 0.3s ease;\n  box-sizing: border-box;\n  overflow-x: hidden;\n}\n.content.sidebar-collapsed {\n  margin-left: 70px;\n  width: calc(100% - 70px);\n}\n.profile-header {\n  margin-bottom: 40px;\n  padding-bottom: 20px;\n  border-bottom: 3px solid rgba(102, 126, 234, 0.3);\n}\n.header-top {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n  margin-bottom: 15px;\n  flex-wrap: wrap;\n}\n.menu-toggle {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  border: none;\n  color: white;\n  width: 50px;\n  height: 50px;\n  border-radius: 12px;\n  font-size: 1.5rem;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.3s ease;\n  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);\n  flex-shrink: 0;\n}\n.menu-toggle:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);\n}\n.menu-toggle:active {\n  transform: scale(0.95);\n}\n.profile-header h1 {\n  font-size: 2.5rem;\n  color: #2c3e50;\n  margin: 0;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  word-break: break-word;\n  font-weight: 700;\n  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);\n}\n.profile-header h1 i {\n  flex-shrink: 0;\n  color: #667eea;\n}\n.profile-header p {\n  color: #666;\n  margin: 10px 0 0 0;\n  word-break: break-word;\n  font-size: 1.1rem;\n}\n.profile-container {\n  display: flex;\n  flex-direction: column;\n  gap: 25px;\n}\n.avatar-section {\n  text-align: center;\n  background: white;\n  padding: 40px 30px;\n  border-radius: 16px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);\n  border: 1px solid rgba(255, 255, 255, 0.5);\n  transition: all 0.3s ease;\n}\n.avatar-section:hover {\n  transform: translateY(-5px);\n  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);\n}\n.avatar {\n  width: 150px;\n  height: 150px;\n  border-radius: 50%;\n  object-fit: cover;\n  border: 5px solid;\n  border-image:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%) 1;\n  margin-bottom: 20px;\n  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);\n  transition: all 0.3s ease;\n}\n.avatar-section h2 {\n  margin: 20px 0 10px;\n  font-size: 1.8em;\n  color: #2c3e50;\n  word-break: break-word;\n  font-weight: 700;\n}\n.member-since {\n  color: #999;\n  font-size: 1em;\n  margin: 0;\n}\n.profile-card {\n  background: white;\n  border-radius: 16px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);\n  padding: 30px !important;\n  border: 1px solid rgba(255, 255, 255, 0.5);\n  transition: all 0.3s ease;\n}\n.profile-card:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);\n}\n.profile-card .p-card-header {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: white !important;\n  margin: -30px -30px 20px -30px;\n  padding: 20px 30px;\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  border-radius: 16px 16px 0 0;\n}\n.profile-info {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n.info-row {\n  display: flex;\n  padding: 15px 0;\n  border-bottom: 2px solid #f0f0f0;\n  word-break: break-word;\n  transition: all 0.3s ease;\n}\n.info-row:last-child {\n  border-bottom: none;\n}\n.info-row:hover {\n  background-color: #f8f9fa;\n  padding-left: 10px;\n  padding-right: 10px;\n  margin-left: -10px;\n  margin-right: -10px;\n}\n.info-row label {\n  font-weight: 700;\n  color: #667eea;\n  min-width: 140px;\n  flex-shrink: 0;\n  text-transform: uppercase;\n  font-size: 0.9rem;\n  letter-spacing: 0.5px;\n}\n.info-row span {\n  color: #555;\n  flex: 1;\n  word-break: break-word;\n  font-size: 1.05rem;\n}\n.profile-form {\n  display: flex;\n  flex-direction: column;\n  gap: 25px;\n}\n.form-group {\n  display: flex;\n  flex-direction: column;\n}\n.form-group label {\n  font-weight: 700;\n  color: #2c3e50;\n  margin-bottom: 8px;\n  text-transform: uppercase;\n  font-size: 0.9rem;\n  letter-spacing: 0.5px;\n}\n.form-control,\ninput[pInputText],\ntextarea.form-textarea {\n  padding: 12px 16px;\n  border: 2px solid #e0e6ed;\n  border-radius: 8px;\n  font-size: 1em;\n  width: 100%;\n  box-sizing: border-box;\n  transition: all 0.3s ease;\n  background-color: #f8f9fa;\n  font-family:\n    "Segoe UI",\n    Tahoma,\n    Geneva,\n    Verdana,\n    sans-serif;\n}\n.form-control:focus,\ninput[pInputText]:focus,\ntextarea.form-textarea:focus {\n  outline: none;\n  border-color: #667eea;\n  background-color: white;\n  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);\n}\ntextarea.form-textarea {\n  resize: vertical;\n  min-height: 120px;\n  font-family:\n    "Segoe UI",\n    Tahoma,\n    Geneva,\n    Verdana,\n    sans-serif;\n}\n.button-group {\n  display: flex;\n  gap: 15px;\n  margin-top: 30px;\n  padding-top: 25px;\n  border-top: 2px solid #f0f0f0;\n  flex-wrap: wrap;\n}\n.button-group :deep(.p-button) {\n  padding: 12px 24px !important;\n  font-weight: 600;\n  border-radius: 8px !important;\n  transition: all 0.3s ease !important;\n}\n.button-group :deep(.p-button-success) {\n  background:\n    linear-gradient(\n      135deg,\n      #11998e 0%,\n      #38ef7d 100%) !important;\n  border: none !important;\n}\n.button-group :deep(.p-button-success:hover) {\n  transform: translateY(-2px) !important;\n  box-shadow: 0 6px 20px rgba(17, 153, 142, 0.4) !important;\n}\n.button-group :deep(.p-button-secondary) {\n  background-color: #95a5a6 !important;\n  border: none !important;\n}\n.button-group :deep(.p-button-secondary:hover) {\n  background-color: #7f8c8d !important;\n  transform: translateY(-2px) !important;\n}\n.button-group :deep(.p-button-info) {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%) !important;\n  border: none !important;\n}\n.button-group :deep(.p-button-info:hover) {\n  transform: translateY(-2px) !important;\n  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;\n}\n.stats-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 20px;\n  padding: 0;\n}\n.stat-card {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n  padding: 25px 20px;\n  border-radius: 12px;\n  text-align: center;\n  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);\n  transition: all 0.3s ease;\n}\n.stat-card:hover {\n  transform: translateY(-8px);\n  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5);\n}\n.stat-card i {\n  font-size: 2.5em;\n  margin-bottom: 12px;\n  display: block;\n  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);\n}\n.stat-card h4 {\n  margin: 12px 0 8px;\n  font-size: 1.1em;\n  word-break: break-word;\n  font-weight: 700;\n}\n.stat-card p {\n  margin: 0;\n  font-size: 1.8em;\n  font-weight: bold;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);\n}\n.settings-list {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n.setting-item {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px;\n  background:\n    linear-gradient(\n      135deg,\n      #f8f9fa 0%,\n      #fff 100%);\n  border-radius: 12px;\n  border-left: 5px solid #667eea;\n  gap: 20px;\n  transition: all 0.3s ease;\n}\n.setting-item:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #fff 0%,\n      #f8f9fa 100%);\n  transform: translateX(8px);\n  border-left-color: #764ba2;\n  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);\n}\n.setting-item div h5 {\n  margin: 0 0 8px;\n  color: #2c3e50;\n  word-break: break-word;\n  font-weight: 700;\n  font-size: 1.1rem;\n}\n.setting-item div p {\n  margin: 0;\n  color: #666;\n  font-size: 0.95em;\n  word-break: break-word;\n}\n.setting-item :deep(.p-button) {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%) !important;\n  border: none !important;\n  padding: 10px 18px !important;\n  font-weight: 600;\n  transition: all 0.3s ease !important;\n}\n.setting-item :deep(.p-button:hover) {\n  transform: translateY(-2px) !important;\n  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;\n}\n.danger-card {\n  border: 2px solid #e74c3c !important;\n  background:\n    linear-gradient(\n      135deg,\n      #ffe6e6 0%,\n      #fff 100%) !important;\n  padding: 30px !important;\n}\n.danger-card .p-card-header {\n  background:\n    linear-gradient(\n      135deg,\n      #e74c3c 0%,\n      #c0392b 100%) !important;\n  color: white !important;\n  font-weight: 700;\n  margin: -30px -30px 20px -30px !important;\n  padding: 20px 30px !important;\n}\n.danger-item {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 25px;\n  background:\n    linear-gradient(\n      135deg,\n      #ffebee 0%,\n      #fff 100%);\n  border-radius: 12px;\n  border-left: 5px solid #e74c3c;\n  gap: 20px;\n  transition: all 0.3s ease;\n}\n.danger-item:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #ffcdd2 0%,\n      #ffebee 100%);\n  transform: translateX(8px);\n  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.2);\n}\n.danger-item div h5 {\n  margin: 0 0 8px;\n  color: #c0392b;\n  font-weight: 700;\n  word-break: break-word;\n  font-size: 1.1rem;\n}\n.danger-item div p {\n  margin: 0;\n  color: #e74c3c;\n  font-size: 0.95em;\n  word-break: break-word;\n}\n.danger-item :deep(.p-button) {\n  background:\n    linear-gradient(\n      135deg,\n      #e74c3c 0%,\n      #c0392b 100%) !important;\n  border: none !important;\n  padding: 10px 18px !important;\n  font-weight: 600;\n  transition: all 0.3s ease !important;\n}\n.danger-item :deep(.p-button:hover) {\n  transform: translateY(-2px) !important;\n  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4) !important;\n}\n.ml-2 {\n  margin-left: 10px !important;\n}\n.mt-3 {\n  margin-top: 15px !important;\n}\n@media (max-width: 1024px) {\n  .content {\n    margin-left: 250px;\n    width: calc(100% - 250px);\n  }\n  .profile-header h1 {\n    font-size: 1.7rem;\n  }\n  .avatar {\n    width: 100px;\n    height: 100px;\n  }\n  .avatar-section h2 {\n    font-size: 1.3em;\n  }\n  .stats-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (max-width: 768px) {\n  .content {\n    margin-left: 0;\n    width: 100%;\n    padding: 15px;\n  }\n  .content.sidebar-collapsed {\n    margin-left: 0;\n    width: 100%;\n  }\n  .header-top {\n    gap: 10px;\n  }\n  .menu-toggle {\n    width: 40px;\n    height: 40px;\n    font-size: 1.2rem;\n  }\n  .profile-header h1 {\n    font-size: 1.4rem;\n  }\n  .avatar {\n    width: 90px;\n    height: 90px;\n  }\n  .avatar-section h2 {\n    font-size: 1.2em;\n  }\n  .avatar-section {\n    padding: 20px 15px;\n  }\n  .info-row {\n    flex-direction: column;\n    padding: 10px 0;\n  }\n  .info-row label {\n    margin-bottom: 5px;\n    min-width: auto;\n  }\n  .setting-item {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .stats-grid {\n    grid-template-columns: repeat(2, 1fr);\n    gap: 15px;\n  }\n  .stat-card {\n    padding: 15px;\n  }\n  .stat-card i {\n    font-size: 1.5em;\n  }\n  .stat-card h4 {\n    font-size: 0.95em;\n  }\n  .stat-card p {\n    font-size: 1.2em;\n  }\n}\n@media (max-width: 480px) {\n  .content {\n    padding: 10px;\n  }\n  .header-top {\n    gap: 8px;\n    margin-bottom: 15px;\n  }\n  .menu-toggle {\n    width: 38px;\n    height: 38px;\n    font-size: 1rem;\n  }\n  .profile-header h1 {\n    font-size: 1.2rem;\n    gap: 8px;\n  }\n  .profile-header h1 i {\n    font-size: 1.1rem;\n  }\n  .avatar {\n    width: 80px;\n    height: 80px;\n    border-width: 3px;\n  }\n  .avatar-section h2 {\n    font-size: 1rem;\n    margin: 10px 0;\n  }\n  .avatar-section {\n    padding: 15px 10px;\n  }\n  .profile-container {\n    gap: 15px;\n  }\n  .info-row {\n    padding: 8px 0;\n    font-size: 0.9rem;\n  }\n  .info-row label {\n    font-size: 0.85rem;\n  }\n  .form-control {\n    font-size: 16px;\n  }\n  textarea.form-control {\n    min-height: 80px;\n  }\n  .stats-grid {\n    grid-template-columns: 1fr;\n    gap: 12px;\n  }\n  .stat-card {\n    padding: 12px;\n  }\n  .stat-card i {\n    font-size: 1.3em;\n  }\n  .stat-card h4 {\n    font-size: 0.9em;\n    margin: 8px 0 3px;\n  }\n  .stat-card p {\n    font-size: 1.1em;\n  }\n  .setting-item {\n    padding: 15px;\n    flex-direction: column;\n  }\n  .setting-item div h5 {\n    font-size: 0.95rem;\n  }\n  .setting-item div p {\n    font-size: 0.85rem;\n  }\n  .button-group {\n    flex-direction: column;\n    gap: 8px;\n  }\n  .button-group p-button {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=profile.component.css.map */\n'] }]
  }], () => [{ type: SidebarService }, { type: ProfileService }, { type: MessageService }, { type: ConfirmationService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProfileComponent, { className: "ProfileComponent", filePath: "src/app/pages/profile/profile.component.ts", lineNumber: 35 });
})();
export {
  ProfileComponent
};
//# sourceMappingURL=chunk-PZXNPVKT.js.map
