import {
  Password,
  PasswordModule
} from "./chunk-XCAPMW7J.js";
import {
  Checkbox,
  CheckboxModule
} from "./chunk-MV3PAJ4J.js";
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
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext
} from "./chunk-ANLN36LO.js";

// src/app/auth/login/login.component.ts
function LoginComponent_small_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 19);
    \u0275\u0275text(1, " Correo electr\xF3nico v\xE1lido requerido ");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_small_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 19);
    \u0275\u0275text(1, " Contrase\xF1a requerida ");
    \u0275\u0275elementEnd();
  }
}
var LoginComponent = class _LoginComponent {
  fb;
  messageService;
  router;
  loginForm;
  loading = false;
  // 🔐 Credenciales hardcodeadas
  HARDCODED_EMAIL = "admin@test.com";
  HARDCODED_PASSWORD = "Admin@12345";
  constructor(fb, messageService, router) {
    this.fb = fb;
    this.messageService = messageService;
    this.router = router;
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      rememberMe: [false]
    });
  }
  onSubmit() {
    if (this.loginForm.invalid) {
      this.messageService.add({
        severity: "warn",
        summary: "Campos inv\xE1lidos",
        detail: "Completa todos los campos correctamente"
      });
      return;
    }
    this.loading = true;
    const { email, password } = this.loginForm.value;
    setTimeout(() => {
      if (email === this.HARDCODED_EMAIL && password === this.HARDCODED_PASSWORD) {
        this.messageService.add({
          severity: "success",
          summary: "Login correcto",
          detail: "Bienvenido al sistema"
        });
        setTimeout(() => {
          this.router.navigate(["/home"]);
        }, 1e3);
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Credenciales incorrectas",
          detail: "Email o contrase\xF1a incorrectos"
        });
      }
      this.loading = false;
    }, 1e3);
  }
  static \u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(MessageService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 33, vars: 10, consts: [[1, "auth-container"], [1, "auth-card"], [1, "logo-section"], [1, "pi", "pi-lock", 2, "font-size", "3rem", "color", "#6c757d"], [3, "ngSubmit", "formGroup"], [1, "field"], ["for", "email"], [1, "p-input-icon-left"], [1, "pi", "pi-envelope"], ["type", "email", "id", "email", "placeholder", "Ingresa tu correo", "formControlName", "email", 1, "w-full", "p-inputtext"], ["class", "p-error", 4, "ngIf"], ["for", "password"], [1, "pi", "pi-lock"], ["id", "password", "formControlName", "password", "placeholder", "Ingresa tu contrase\xF1a", "inputId", "password", 1, "w-full", 3, "feedback"], [1, "field-checkbox"], ["label", "Recordarme", "formControlName", "rememberMe", "inputId", "remember"], ["type", "submit", "label", "Iniciar Sesi\xF3n", "icon", "pi pi-sign-in", 1, "w-full", "login-btn", 3, "loading", "disabled"], [1, "auth-footer"], ["routerLink", "/auth/register"], [1, "p-error"]], template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "p-toast");
      \u0275\u0275elementStart(1, "div", 0)(2, "div", 1)(3, "div", 2);
      \u0275\u0275element(4, "i", 3);
      \u0275\u0275elementStart(5, "h2");
      \u0275\u0275text(6, "Bienvenido de Vuelta");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p");
      \u0275\u0275text(8, "Por favor inicia sesi\xF3n en tu cuenta");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(9, "form", 4);
      \u0275\u0275listener("ngSubmit", function LoginComponent_Template_form_ngSubmit_9_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275elementStart(10, "div", 5)(11, "label", 6);
      \u0275\u0275text(12, "Correo Electr\xF3nico");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "span", 7);
      \u0275\u0275element(14, "i", 8)(15, "input", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275template(16, LoginComponent_small_16_Template, 2, 0, "small", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "div", 5)(18, "label", 11);
      \u0275\u0275text(19, "Contrase\xF1a");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "span", 7);
      \u0275\u0275element(21, "i", 12)(22, "p-password", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275template(23, LoginComponent_small_23_Template, 2, 0, "small", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "div", 14);
      \u0275\u0275element(25, "p-checkbox", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275element(26, "p-button", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "div", 17)(28, "p");
      \u0275\u0275text(29, "\xBFNo tienes una cuenta? ");
      \u0275\u0275elementStart(30, "a", 18)(31, "strong");
      \u0275\u0275text(32, "Reg\xEDstrate aqu\xED");
      \u0275\u0275elementEnd()()()()()();
    }
    if (rf & 2) {
      let tmp_1_0;
      let tmp_2_0;
      let tmp_3_0;
      let tmp_5_0;
      \u0275\u0275advance(9);
      \u0275\u0275property("formGroup", ctx.loginForm);
      \u0275\u0275advance(6);
      \u0275\u0275classProp("ng-invalid", ((tmp_1_0 = ctx.loginForm.get("email")) == null ? null : tmp_1_0.invalid) && ((tmp_1_0 = ctx.loginForm.get("email")) == null ? null : tmp_1_0.touched));
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ((tmp_2_0 = ctx.loginForm.get("email")) == null ? null : tmp_2_0.invalid) && ((tmp_2_0 = ctx.loginForm.get("email")) == null ? null : tmp_2_0.touched));
      \u0275\u0275advance(6);
      \u0275\u0275classProp("ng-invalid", ((tmp_3_0 = ctx.loginForm.get("password")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx.loginForm.get("password")) == null ? null : tmp_3_0.touched));
      \u0275\u0275property("feedback", false);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ((tmp_5_0 = ctx.loginForm.get("password")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = ctx.loginForm.get("password")) == null ? null : tmp_5_0.touched));
      \u0275\u0275advance(3);
      \u0275\u0275property("loading", ctx.loading)("disabled", ctx.loginForm.invalid);
    }
  }, dependencies: [
    RouterModule,
    RouterLink,
    ReactiveFormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    FormGroupDirective,
    FormControlName,
    CommonModule,
    NgIf,
    InputTextModule,
    PasswordModule,
    Password,
    ButtonModule,
    Button,
    ToastModule,
    Toast,
    CheckboxModule,
    Checkbox
  ], styles: [`

.auth-container[_ngcontent-%COMP%] {
  height: 100vh;
  background:
    linear-gradient(
      135deg,
      #f5f7fa 0%,
      #c3cfe2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Segoe UI", sans-serif;
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
  width: 420px;
  max-width: 90%;
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
.field[_ngcontent-%COMP%] {
  margin-bottom: 25px;
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
.p-error[_ngcontent-%COMP%] {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
}
.field-checkbox[_ngcontent-%COMP%] {
  margin-bottom: 30px;
  text-align: left;
}
.field-checkbox[_ngcontent-%COMP%]   p-checkbox[_ngcontent-%COMP%] {
  margin-bottom: 0;
}
.field-checkbox[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {
  font-weight: 500;
  color: #2c3e50;
}
.login-btn[_ngcontent-%COMP%] {
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
.login-btn[_ngcontent-%COMP%]:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}
.login-btn[_ngcontent-%COMP%]:disabled {
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
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}
.auth-footer[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {
  color: #2980b9;
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
@media (max-width: 480px) {
  .auth-card[_ngcontent-%COMP%] {
    padding: 30px 20px;
    margin: 20px;
  }
  .logo-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {
    font-size: 1.8rem;
  }
}
.btn[_ngcontent-%COMP%] {
  position: relative;
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  overflow: hidden;
}
.primary[_ngcontent-%COMP%] {
  background:
    linear-gradient(
      135deg,
      #3b82f6,
      #2563eb);
  color: white;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}
.primary[_ngcontent-%COMP%]:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(59, 130, 246, 0.5);
}
.primary[_ngcontent-%COMP%]:active {
  transform: scale(0.97);
}
.secondary[_ngcontent-%COMP%] {
  background: transparent;
  border: 2px solid #3b82f6;
  color: #3b82f6;
}
.secondary[_ngcontent-%COMP%]:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-3px);
}
.btn[_ngcontent-%COMP%]::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background:
    linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent);
  transition: 0.6s;
}
.btn[_ngcontent-%COMP%]:hover::after {
  left: 100%;
}
/*# sourceMappingURL=login.component.css.map */`] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoginComponent, [{
    type: Component,
    args: [{ selector: "app-login", standalone: true, imports: [
      RouterModule,
      ReactiveFormsModule,
      CommonModule,
      InputTextModule,
      PasswordModule,
      ButtonModule,
      ToastModule,
      CheckboxModule
    ], providers: [MessageService], template: `<p-toast></p-toast>\r
\r
<div class="auth-container">\r
  <div class="auth-card">\r
    <div class="logo-section">\r
      <i class="pi pi-lock" style="font-size: 3rem; color: #6c757d;"></i>\r
      <h2>Bienvenido de Vuelta</h2>\r
      <p>Por favor inicia sesi\xF3n en tu cuenta</p>\r
    </div>\r
\r
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">\r
      <div class="field">\r
        <label for="email">Correo Electr\xF3nico</label>\r
        <span class="p-input-icon-left">\r
          <i class="pi pi-envelope"></i>\r
          <input\r
            type="email"\r
            id="email"\r
            placeholder="Ingresa tu correo"\r
            formControlName="email"\r
            class="w-full p-inputtext"\r
            [class.ng-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"\r
          />\r
        </span>\r
        <small class="p-error" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">\r
          Correo electr\xF3nico v\xE1lido requerido\r
        </small>\r
      </div>\r
\r
      <div class="field">\r
        <label for="password">Contrase\xF1a</label>\r
        <span class="p-input-icon-left">\r
          <i class="pi pi-lock"></i>\r
          <p-password\r
            id="password"\r
            formControlName="password"\r
            placeholder="Ingresa tu contrase\xF1a"\r
            [feedback]="false"\r
            class="w-full"\r
            inputId="password"\r
            [class.ng-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"\r
          ></p-password>\r
        </span>\r
        <small class="p-error" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">\r
          Contrase\xF1a requerida\r
        </small>\r
      </div>\r
\r
      <div class="field-checkbox">\r
        <p-checkbox\r
          label="Recordarme"\r
          formControlName="rememberMe"\r
          inputId="remember"\r
        ></p-checkbox>\r
      </div>\r
\r
      <p-button\r
        type="submit"\r
        label="Iniciar Sesi\xF3n"\r
        [loading]="loading"\r
        [disabled]="loginForm.invalid"\r
        class="w-full login-btn"\r
        icon="pi pi-sign-in"\r
      ></p-button>\r
    </form>\r
\r
    <div class="auth-footer">\r
      <p>\xBFNo tienes una cuenta?\r
        <a routerLink="/auth/register">\r
          <strong>Reg\xEDstrate aqu\xED</strong>\r
        </a>\r
      </p>\r
    </div>\r
  </div>\r
</div>`, styles: [`/* src/app/auth/login/login.component.css */
.auth-container {
  height: 100vh;
  background:
    linear-gradient(
      135deg,
      #f5f7fa 0%,
      #c3cfe2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Segoe UI", sans-serif;
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
  width: 420px;
  max-width: 90%;
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
.field {
  margin-bottom: 25px;
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
.p-error {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
}
.field-checkbox {
  margin-bottom: 30px;
  text-align: left;
}
.field-checkbox p-checkbox {
  margin-bottom: 0;
}
.field-checkbox label {
  font-weight: 500;
  color: #2c3e50;
}
.login-btn {
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
.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}
.login-btn:disabled {
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
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}
.auth-footer a:hover {
  color: #2980b9;
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
@media (max-width: 480px) {
  .auth-card {
    padding: 30px 20px;
    margin: 20px;
  }
  .logo-section h2 {
    font-size: 1.8rem;
  }
}
.btn {
  position: relative;
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  overflow: hidden;
}
.primary {
  background:
    linear-gradient(
      135deg,
      #3b82f6,
      #2563eb);
  color: white;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}
.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(59, 130, 246, 0.5);
}
.primary:active {
  transform: scale(0.97);
}
.secondary {
  background: transparent;
  border: 2px solid #3b82f6;
  color: #3b82f6;
}
.secondary:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-3px);
}
.btn::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background:
    linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent);
  transition: 0.6s;
}
.btn:hover::after {
  left: 100%;
}
/*# sourceMappingURL=login.component.css.map */
`] }]
  }], () => [{ type: FormBuilder }, { type: MessageService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/auth/login/login.component.ts", lineNumber: 29 });
})();
export {
  LoginComponent
};
//# sourceMappingURL=chunk-XLB5CTQZ.js.map
