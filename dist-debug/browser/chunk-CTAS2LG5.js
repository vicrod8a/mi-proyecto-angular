import {
  Password,
  PasswordModule
} from "./chunk-XCAPMW7J.js";
import "./chunk-S26L266D.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  InputTextModule,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Toast,
  ToastModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-7DWSOU2V.js";
import "./chunk-WWG27WRZ.js";
import {
  Button,
  ButtonModule
} from "./chunk-HWDZGNHS.js";
import {
  MessageService
} from "./chunk-JNXR6VHA.js";
import {
  CommonModule,
  Component,
  NgIf,
  Router,
  RouterLink,
  RouterModule,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext
} from "./chunk-ANLN36LO.js";

// src/app/auth/register/register.component.ts
function RegisterComponent_small_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 36);
    \u0275\u0275text(1, " El nombre de usuario es requerido ");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_small_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 36);
    \u0275\u0275text(1, " El nombre completo es requerido ");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_small_31_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "El correo electr\xF3nico es requerido");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_small_31_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Ingresa un correo electr\xF3nico v\xE1lido");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_small_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 36);
    \u0275\u0275template(1, RegisterComponent_small_31_span_1_Template, 2, 0, "span", 37)(2, RegisterComponent_small_31_span_2_Template, 2, 0, "span", 37);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_1_0 = ctx_r0.registerForm.get("email")) == null ? null : tmp_1_0.errors == null ? null : tmp_1_0.errors["required"]);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_2_0 = ctx_r0.registerForm.get("email")) == null ? null : tmp_2_0.errors == null ? null : tmp_2_0.errors["email"]);
  }
}
function RegisterComponent_small_38_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "El n\xFAmero de tel\xE9fono es requerido");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_small_38_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Ingresa un n\xFAmero de tel\xE9fono v\xE1lido (10 d\xEDgitos)");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_small_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 36);
    \u0275\u0275template(1, RegisterComponent_small_38_span_1_Template, 2, 0, "span", 37)(2, RegisterComponent_small_38_span_2_Template, 2, 0, "span", 37);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_1_0 = ctx_r0.registerForm.get("phone")) == null ? null : tmp_1_0.errors == null ? null : tmp_1_0.errors["required"]);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_2_0 = ctx_r0.registerForm.get("phone")) == null ? null : tmp_2_0.errors == null ? null : tmp_2_0.errors["pattern"]);
  }
}
function RegisterComponent_small_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 36);
    \u0275\u0275text(1, " La direcci\xF3n es requerida ");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_small_52_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "La fecha de nacimiento es requerida");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_small_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 36);
    \u0275\u0275template(1, RegisterComponent_small_52_span_1_Template, 2, 0, "span", 37);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_1_0 = ctx_r0.registerForm.get("birthDate")) == null ? null : tmp_1_0.errors == null ? null : tmp_1_0.errors["required"]);
  }
}
function RegisterComponent_small_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 36);
    \u0275\u0275text(1, " Debes tener al menos 18 a\xF1os para registrarte ");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_small_60_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "La contrase\xF1a es requerida");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_small_60_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "La contrase\xF1a debe tener al menos 10 caracteres e incluir al menos un s\xEDmbolo especial (!@#$%&*?)");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_small_60_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 36);
    \u0275\u0275template(1, RegisterComponent_small_60_span_1_Template, 2, 0, "span", 37)(2, RegisterComponent_small_60_span_2_Template, 2, 0, "span", 37);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_1_0 = ctx_r0.registerForm.get("password")) == null ? null : tmp_1_0.errors == null ? null : tmp_1_0.errors["required"]);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_2_0 = ctx_r0.registerForm.get("password")) == null ? null : tmp_2_0.errors == null ? null : tmp_2_0.errors["pattern"]);
  }
}
function RegisterComponent_small_67_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "La confirmaci\xF3n de contrase\xF1a es requerida");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_small_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 36);
    \u0275\u0275template(1, RegisterComponent_small_67_span_1_Template, 2, 0, "span", 37);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_1_0 = ctx_r0.registerForm.get("confirmPassword")) == null ? null : tmp_1_0.errors == null ? null : tmp_1_0.errors["required"]);
  }
}
function RegisterComponent_small_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 36);
    \u0275\u0275text(1, " Las contrase\xF1as no coinciden ");
    \u0275\u0275elementEnd();
  }
}
var RegisterComponent = class _RegisterComponent {
  fb;
  messageService;
  router;
  registerForm;
  constructor(fb, messageService, router) {
    this.fb = fb;
    this.messageService = messageService;
    this.router = router;
    this.registerForm = this.fb.group({
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [
        Validators.required,
        Validators.pattern(/^(?=.*[!@#$%&*?]).{10,}$/)
      ]],
      confirmPassword: ["", Validators.required],
      fullName: ["", Validators.required],
      address: ["", Validators.required],
      phone: ["", [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],
      birthDate: ["", Validators.required]
    }, { validators: [this.passwordMatchValidator, this.ageValidator] });
  }
  passwordMatchValidator(form) {
    const password = form.get("password")?.value;
    const confirm = form.get("confirmPassword")?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }
  ageValidator(form) {
    const birthDate = form.get("birthDate")?.value;
    if (!birthDate)
      return null;
    const today = /* @__PURE__ */ new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();
    if (month < 0 || month === 0 && today.getDate() < birth.getDate()) {
      age--;
    }
    return age >= 18 ? null : { underAge: true };
  }
  onSubmit() {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach((key) => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
      this.messageService.add({
        severity: "error",
        summary: "Formulario inv\xE1lido",
        detail: "Por favor, revisa todos los campos requeridos"
      });
      return;
    }
    this.messageService.add({
      severity: "success",
      summary: "Registro exitoso",
      detail: "Cuenta creada correctamente. Redirigiendo al inicio de sesi\xF3n..."
    });
    this.registerForm.reset();
    setTimeout(() => {
      this.router.navigate(["/auth/login"]);
    }, 2e3);
  }
  static \u0275fac = function RegisterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RegisterComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(MessageService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RegisterComponent, selectors: [["app-register"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 76, vars: 13, consts: [[1, "auth-container"], [1, "auth-card"], [1, "logo-section"], [1, "pi", "pi-user-plus", 2, "font-size", "3rem", "color", "#6c757d"], [3, "ngSubmit", "formGroup"], [1, "form-grid"], [1, "field"], ["for", "username"], [1, "p-input-icon-left"], [1, "pi", "pi-user"], ["type", "text", "id", "username", "placeholder", "Elige un nombre de usuario", "formControlName", "username", 1, "w-full", "p-inputtext"], ["class", "p-error", 4, "ngIf"], ["for", "fullName"], [1, "pi", "pi-id-card"], ["type", "text", "id", "fullName", "placeholder", "Ingresa tu nombre completo", "formControlName", "fullName", 1, "w-full", "p-inputtext"], ["for", "email"], [1, "pi", "pi-envelope"], ["type", "email", "id", "email", "placeholder", "Ingresa tu correo electr\xF3nico", "formControlName", "email", 1, "w-full", "p-inputtext"], ["for", "phone"], [1, "pi", "pi-phone"], ["type", "tel", "id", "phone", "placeholder", "Ingresa tu n\xFAmero de tel\xE9fono", "formControlName", "phone", 1, "w-full", "p-inputtext"], ["for", "address"], [1, "pi", "pi-map-marker"], ["type", "text", "id", "address", "placeholder", "Ingresa tu direcci\xF3n", "formControlName", "address", 1, "w-full", "p-inputtext"], ["for", "birthDate"], [1, "pi", "pi-calendar"], ["type", "date", "id", "birthDate", "placeholder", "Selecciona fecha de nacimiento", "formControlName", "birthDate", 1, "w-full", "p-inputtext"], [1, "field", "full-width"], ["for", "password"], [1, "pi", "pi-lock"], ["id", "password", "formControlName", "password", "placeholder", "Crea una contrase\xF1a", 1, "w-full"], ["for", "confirmPassword"], ["id", "confirmPassword", "formControlName", "confirmPassword", "placeholder", "Confirma tu contrase\xF1a", 1, "w-full", 3, "feedback"], ["type", "submit", "label", "Crear Cuenta", "icon", "pi pi-user-plus", 1, "w-full", "register-btn", 3, "disabled"], [1, "auth-footer"], ["routerLink", "/auth/login"], [1, "p-error"], [4, "ngIf"]], template: function RegisterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "p-toast");
      \u0275\u0275elementStart(1, "div", 0)(2, "div", 1)(3, "div", 2);
      \u0275\u0275element(4, "i", 3);
      \u0275\u0275elementStart(5, "h2");
      \u0275\u0275text(6, "Crear Cuenta");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p");
      \u0275\u0275text(8, "\xDAnete a nosotros hoy y comienza");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(9, "form", 4);
      \u0275\u0275listener("ngSubmit", function RegisterComponent_Template_form_ngSubmit_9_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275elementStart(10, "div", 5)(11, "div", 6)(12, "label", 7);
      \u0275\u0275text(13, "Nombre de Usuario");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "span", 8);
      \u0275\u0275element(15, "i", 9)(16, "input", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275template(17, RegisterComponent_small_17_Template, 2, 0, "small", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "div", 6)(19, "label", 12);
      \u0275\u0275text(20, "Nombre Completo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "span", 8);
      \u0275\u0275element(22, "i", 13)(23, "input", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275template(24, RegisterComponent_small_24_Template, 2, 0, "small", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "div", 6)(26, "label", 15);
      \u0275\u0275text(27, "Correo Electr\xF3nico");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "span", 8);
      \u0275\u0275element(29, "i", 16)(30, "input", 17);
      \u0275\u0275elementEnd();
      \u0275\u0275template(31, RegisterComponent_small_31_Template, 3, 2, "small", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "div", 6)(33, "label", 18);
      \u0275\u0275text(34, "N\xFAmero de Tel\xE9fono");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "span", 8);
      \u0275\u0275element(36, "i", 19)(37, "input", 20);
      \u0275\u0275elementEnd();
      \u0275\u0275template(38, RegisterComponent_small_38_Template, 3, 2, "small", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "div", 6)(40, "label", 21);
      \u0275\u0275text(41, "Direcci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "span", 8);
      \u0275\u0275element(43, "i", 22)(44, "input", 23);
      \u0275\u0275elementEnd();
      \u0275\u0275template(45, RegisterComponent_small_45_Template, 2, 0, "small", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "div", 6)(47, "label", 24);
      \u0275\u0275text(48, "Fecha de Nacimiento");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "span", 8);
      \u0275\u0275element(50, "i", 25)(51, "input", 26);
      \u0275\u0275elementEnd();
      \u0275\u0275template(52, RegisterComponent_small_52_Template, 2, 1, "small", 11)(53, RegisterComponent_small_53_Template, 2, 0, "small", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "div", 27)(55, "label", 28);
      \u0275\u0275text(56, "Contrase\xF1a");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(57, "span", 8);
      \u0275\u0275element(58, "i", 29)(59, "p-password", 30);
      \u0275\u0275elementEnd();
      \u0275\u0275template(60, RegisterComponent_small_60_Template, 3, 2, "small", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(61, "div", 27)(62, "label", 31);
      \u0275\u0275text(63, "Confirmar Contrase\xF1a");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(64, "span", 8);
      \u0275\u0275element(65, "i", 29)(66, "p-password", 32);
      \u0275\u0275elementEnd();
      \u0275\u0275template(67, RegisterComponent_small_67_Template, 2, 1, "small", 11)(68, RegisterComponent_small_68_Template, 2, 0, "small", 11);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(69, "p-button", 33);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(70, "div", 34)(71, "p");
      \u0275\u0275text(72, "\xBFYa tienes una cuenta? ");
      \u0275\u0275elementStart(73, "a", 35)(74, "strong");
      \u0275\u0275text(75, "Inicia sesi\xF3n aqu\xED");
      \u0275\u0275elementEnd()()()()()();
    }
    if (rf & 2) {
      let tmp_1_0;
      let tmp_2_0;
      let tmp_3_0;
      let tmp_4_0;
      let tmp_5_0;
      let tmp_6_0;
      let tmp_7_0;
      let tmp_8_0;
      let tmp_10_0;
      let tmp_11_0;
      \u0275\u0275advance(9);
      \u0275\u0275property("formGroup", ctx.registerForm);
      \u0275\u0275advance(8);
      \u0275\u0275property("ngIf", ((tmp_1_0 = ctx.registerForm.get("username")) == null ? null : tmp_1_0.invalid) && ((tmp_1_0 = ctx.registerForm.get("username")) == null ? null : tmp_1_0.touched));
      \u0275\u0275advance(7);
      \u0275\u0275property("ngIf", ((tmp_2_0 = ctx.registerForm.get("fullName")) == null ? null : tmp_2_0.invalid) && ((tmp_2_0 = ctx.registerForm.get("fullName")) == null ? null : tmp_2_0.touched));
      \u0275\u0275advance(7);
      \u0275\u0275property("ngIf", ((tmp_3_0 = ctx.registerForm.get("email")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx.registerForm.get("email")) == null ? null : tmp_3_0.touched));
      \u0275\u0275advance(7);
      \u0275\u0275property("ngIf", ((tmp_4_0 = ctx.registerForm.get("phone")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx.registerForm.get("phone")) == null ? null : tmp_4_0.touched));
      \u0275\u0275advance(7);
      \u0275\u0275property("ngIf", ((tmp_5_0 = ctx.registerForm.get("address")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = ctx.registerForm.get("address")) == null ? null : tmp_5_0.touched));
      \u0275\u0275advance(7);
      \u0275\u0275property("ngIf", ((tmp_6_0 = ctx.registerForm.get("birthDate")) == null ? null : tmp_6_0.invalid) && ((tmp_6_0 = ctx.registerForm.get("birthDate")) == null ? null : tmp_6_0.touched));
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", (ctx.registerForm.errors == null ? null : ctx.registerForm.errors["underAge"]) && ((tmp_7_0 = ctx.registerForm.get("birthDate")) == null ? null : tmp_7_0.touched));
      \u0275\u0275advance(7);
      \u0275\u0275property("ngIf", ((tmp_8_0 = ctx.registerForm.get("password")) == null ? null : tmp_8_0.invalid) && ((tmp_8_0 = ctx.registerForm.get("password")) == null ? null : tmp_8_0.touched));
      \u0275\u0275advance(6);
      \u0275\u0275property("feedback", false);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ((tmp_10_0 = ctx.registerForm.get("confirmPassword")) == null ? null : tmp_10_0.invalid) && ((tmp_10_0 = ctx.registerForm.get("confirmPassword")) == null ? null : tmp_10_0.touched));
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", (ctx.registerForm.errors == null ? null : ctx.registerForm.errors["passwordMismatch"]) && ((tmp_11_0 = ctx.registerForm.get("confirmPassword")) == null ? null : tmp_11_0.touched));
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.registerForm.invalid);
    }
  }, dependencies: [
    CommonModule,
    NgIf,
    RouterModule,
    RouterLink,
    ReactiveFormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    FormGroupDirective,
    FormControlName,
    InputTextModule,
    PasswordModule,
    Password,
    ButtonModule,
    Button,
    ToastModule,
    Toast
  ], styles: [`

.auth-container[_ngcontent-%COMP%] {
  min-height: 100vh;
  background:
    linear-gradient(
      135deg,
      #f5f7fa 0%,
      #c3cfe2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Segoe UI", sans-serif;
  padding: 20px;
  position: relative;
  overflow: hidden;
}
.auth-container[_ngcontent-%COMP%]::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(0,0,0,0.05)"/><circle cx="80" cy="80" r="2" fill="rgba(0,0,0,0.05)"/><circle cx="40" cy="60" r="1" fill="rgba(0,0,0,0.05)"/></svg>');
  opacity: 0.3;
}
.auth-card[_ngcontent-%COMP%] {
  background: rgba(255, 255, 255, 0.95);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 15px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: _ngcontent-%COMP%_slideIn 0.6s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.logo-section[_ngcontent-%COMP%] {
  margin-bottom: 30px;
}
.logo-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {
  margin: 15px 0 10px 0;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
}
.logo-section[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
  color: #7f8c8d;
  margin: 0;
  font-size: 1rem;
}
.form-grid[_ngcontent-%COMP%] {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}
.field.full-width[_ngcontent-%COMP%] {
  grid-column: 1 / -1;
}
.field[_ngcontent-%COMP%] {
  text-align: left;
}
.field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}
.p-input-icon-left[_ngcontent-%COMP%] {
  width: 100%;
}
.p-input-icon-left[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {
  color: #95a5a6;
  left: 15px;
}
.p-input-icon-left[_ngcontent-%COMP%]   .p-inputtext[_ngcontent-%COMP%], 
.p-password[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {
  padding-left: 45px !important;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 1rem;
  background-color: #ffffff;
}
.p-input-icon-left[_ngcontent-%COMP%]   .p-inputtext[_ngcontent-%COMP%]:focus, 
.p-password[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {
  border-color: #6c757d;
  box-shadow: 0 0 0 3px rgba(108, 117, 125, 0.1);
}
.p-calendar[_ngcontent-%COMP%] {
  width: 100%;
}
.register-btn[_ngcontent-%COMP%] {
  background:
    linear-gradient(
      135deg,
      #6c757d,
      #495057);
  border: none;
  border-radius: 8px;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.register-btn[_ngcontent-%COMP%]:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}
.register-btn[_ngcontent-%COMP%]:disabled {
  background: #adb5bd;
  transform: none;
  box-shadow: none;
  cursor: not-allowed;
}
.auth-footer[_ngcontent-%COMP%] {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #ecf0f1;
}
.auth-footer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.95rem;
}
.auth-footer[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {
  color: #27ae60;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}
.auth-footer[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {
  color: #2ecc71;
  text-decoration: underline;
}
@keyframes _ngcontent-%COMP%_slideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@media (max-width: 768px) {
  .form-grid[_ngcontent-%COMP%] {
    grid-template-columns: 1fr;
  }
  .auth-card[_ngcontent-%COMP%] {
    padding: 30px 20px;
    margin: 20px;
  }
  .logo-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {
    font-size: 1.8rem;
  }
}
/*# sourceMappingURL=register.component.css.map */`] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RegisterComponent, [{
    type: Component,
    args: [{ selector: "app-register", standalone: true, imports: [
      CommonModule,
      RouterModule,
      ReactiveFormsModule,
      InputTextModule,
      PasswordModule,
      ButtonModule,
      ToastModule
    ], providers: [MessageService], template: `<p-toast></p-toast>\r
\r
<div class="auth-container">\r
  <div class="auth-card">\r
    <div class="logo-section">\r
      <i class="pi pi-user-plus" style="font-size: 3rem; color: #6c757d;"></i>\r
      <h2>Crear Cuenta</h2>\r
      <p>\xDAnete a nosotros hoy y comienza</p>\r
    </div>\r
\r
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">\r
      <div class="form-grid">\r
        <div class="field">\r
          <label for="username">Nombre de Usuario</label>\r
          <span class="p-input-icon-left">\r
            <i class="pi pi-user"></i>\r
            <input type="text" id="username" placeholder="Elige un nombre de usuario" formControlName="username" class="w-full p-inputtext" />\r
          </span>\r
          <small class="p-error" *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched">\r
            El nombre de usuario es requerido\r
          </small>\r
        </div>\r
\r
        <div class="field">\r
          <label for="fullName">Nombre Completo</label>\r
          <span class="p-input-icon-left">\r
            <i class="pi pi-id-card"></i>\r
            <input type="text" id="fullName" placeholder="Ingresa tu nombre completo" formControlName="fullName" class="w-full p-inputtext" />\r
          </span>\r
          <small class="p-error" *ngIf="registerForm.get('fullName')?.invalid && registerForm.get('fullName')?.touched">\r
            El nombre completo es requerido\r
          </small>\r
        </div>\r
\r
        <div class="field">\r
          <label for="email">Correo Electr\xF3nico</label>\r
          <span class="p-input-icon-left">\r
            <i class="pi pi-envelope"></i>\r
            <input type="email" id="email" placeholder="Ingresa tu correo electr\xF3nico" formControlName="email" class="w-full p-inputtext" />\r
          </span>\r
          <small class="p-error" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">\r
            <span *ngIf="registerForm.get('email')?.errors?.['required']">El correo electr\xF3nico es requerido</span>\r
            <span *ngIf="registerForm.get('email')?.errors?.['email']">Ingresa un correo electr\xF3nico v\xE1lido</span>\r
          </small>\r
        </div>\r
\r
        <div class="field">\r
          <label for="phone">N\xFAmero de Tel\xE9fono</label>\r
          <span class="p-input-icon-left">\r
            <i class="pi pi-phone"></i>\r
            <input type="tel" id="phone" placeholder="Ingresa tu n\xFAmero de tel\xE9fono" formControlName="phone" class="w-full p-inputtext" />\r
          </span>\r
          <small class="p-error" *ngIf="registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched">\r
            <span *ngIf="registerForm.get('phone')?.errors?.['required']">El n\xFAmero de tel\xE9fono es requerido</span>\r
            <span *ngIf="registerForm.get('phone')?.errors?.['pattern']">Ingresa un n\xFAmero de tel\xE9fono v\xE1lido (10 d\xEDgitos)</span>\r
          </small>\r
        </div>\r
\r
        <div class="field">\r
          <label for="address">Direcci\xF3n</label>\r
          <span class="p-input-icon-left">\r
            <i class="pi pi-map-marker"></i>\r
            <input type="text" id="address" placeholder="Ingresa tu direcci\xF3n" formControlName="address" class="w-full p-inputtext" />\r
          </span>\r
          <small class="p-error" *ngIf="registerForm.get('address')?.invalid && registerForm.get('address')?.touched">\r
            La direcci\xF3n es requerida\r
          </small>\r
        </div>\r
\r
        <div class="field">\r
          <label for="birthDate">Fecha de Nacimiento</label>\r
          <span class="p-input-icon-left">\r
            <i class="pi pi-calendar"></i>\r
            <input type="date" id="birthDate" placeholder="Selecciona fecha de nacimiento" formControlName="birthDate" class="w-full p-inputtext" />\r
          </span>\r
          <small class="p-error" *ngIf="registerForm.get('birthDate')?.invalid && registerForm.get('birthDate')?.touched">\r
            <span *ngIf="registerForm.get('birthDate')?.errors?.['required']">La fecha de nacimiento es requerida</span>\r
          </small>\r
          <small class="p-error" *ngIf="registerForm.errors?.['underAge'] && registerForm.get('birthDate')?.touched">\r
            Debes tener al menos 18 a\xF1os para registrarte\r
          </small>\r
        </div>\r
\r
        <div class="field full-width">\r
          <label for="password">Contrase\xF1a</label>\r
          <span class="p-input-icon-left">\r
            <i class="pi pi-lock"></i>\r
            <p-password id="password" formControlName="password" placeholder="Crea una contrase\xF1a" class="w-full"></p-password>\r
          </span>\r
          <small class="p-error" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">\r
            <span *ngIf="registerForm.get('password')?.errors?.['required']">La contrase\xF1a es requerida</span>\r
            <span *ngIf="registerForm.get('password')?.errors?.['pattern']">La contrase\xF1a debe tener al menos 10 caracteres e incluir al menos un s\xEDmbolo especial (!@#$%&*?)</span>\r
          </small>\r
        </div>\r
\r
        <div class="field full-width">\r
          <label for="confirmPassword">Confirmar Contrase\xF1a</label>\r
          <span class="p-input-icon-left">\r
            <i class="pi pi-lock"></i>\r
            <p-password id="confirmPassword" formControlName="confirmPassword" placeholder="Confirma tu contrase\xF1a" [feedback]="false" class="w-full"></p-password>\r
          </span>\r
          <small class="p-error" *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">\r
            <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">La confirmaci\xF3n de contrase\xF1a es requerida</span>\r
          </small>\r
          <small class="p-error" *ngIf="registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched">\r
            Las contrase\xF1as no coinciden\r
          </small>\r
        </div>\r
      </div>\r
\r
      <p-button\r
        type="submit"\r
        label="Crear Cuenta"\r
        [disabled]="registerForm.invalid"\r
        class="w-full register-btn"\r
        icon="pi pi-user-plus"\r
      ></p-button>\r
    </form>\r
\r
    <div class="auth-footer">\r
      <p>\xBFYa tienes una cuenta?\r
        <a routerLink="/auth/login">\r
          <strong>Inicia sesi\xF3n aqu\xED</strong>\r
        </a>\r
      </p>\r
    </div>\r
  </div>\r
</div>`, styles: [`/* src/app/auth/register/register.component.css */
.auth-container {
  min-height: 100vh;
  background:
    linear-gradient(
      135deg,
      #f5f7fa 0%,
      #c3cfe2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Segoe UI", sans-serif;
  padding: 20px;
  position: relative;
  overflow: hidden;
}
.auth-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(0,0,0,0.05)"/><circle cx="80" cy="80" r="2" fill="rgba(0,0,0,0.05)"/><circle cx="40" cy="60" r="1" fill="rgba(0,0,0,0.05)"/></svg>');
  opacity: 0.3;
}
.auth-card {
  background: rgba(255, 255, 255, 0.95);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 15px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: slideIn 0.6s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.logo-section {
  margin-bottom: 30px;
}
.logo-section h2 {
  margin: 15px 0 10px 0;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
}
.logo-section p {
  color: #7f8c8d;
  margin: 0;
  font-size: 1rem;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}
.field.full-width {
  grid-column: 1 / -1;
}
.field {
  text-align: left;
}
.field label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}
.p-input-icon-left {
  width: 100%;
}
.p-input-icon-left i {
  color: #95a5a6;
  left: 15px;
}
.p-input-icon-left .p-inputtext,
.p-password input {
  padding-left: 45px !important;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 1rem;
  background-color: #ffffff;
}
.p-input-icon-left .p-inputtext:focus,
.p-password input:focus {
  border-color: #6c757d;
  box-shadow: 0 0 0 3px rgba(108, 117, 125, 0.1);
}
.p-calendar {
  width: 100%;
}
.register-btn {
  background:
    linear-gradient(
      135deg,
      #6c757d,
      #495057);
  border: none;
  border-radius: 8px;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.register-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}
.register-btn:disabled {
  background: #adb5bd;
  transform: none;
  box-shadow: none;
  cursor: not-allowed;
}
.auth-footer {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #ecf0f1;
}
.auth-footer p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.95rem;
}
.auth-footer a {
  color: #27ae60;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}
.auth-footer a:hover {
  color: #2ecc71;
  text-decoration: underline;
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .auth-card {
    padding: 30px 20px;
    margin: 20px;
  }
  .logo-section h2 {
    font-size: 1.8rem;
  }
}
/*# sourceMappingURL=register.component.css.map */
`] }]
  }], () => [{ type: FormBuilder }, { type: MessageService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RegisterComponent, { className: "RegisterComponent", filePath: "src/app/auth/register/register.component.ts", lineNumber: 27 });
})();
export {
  RegisterComponent
};
//# sourceMappingURL=chunk-CTAS2LG5.js.map
