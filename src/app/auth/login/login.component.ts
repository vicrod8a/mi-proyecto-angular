import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  appName = 'Mi App';

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService,
    private permissionService: PermissionService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos inválidos',
        detail: 'Completa todos los campos correctamente'
      });
      return;
    }
    this.loading = true;
    const { email, password } = this.loginForm.value;
    const result = await this.userService.login(email, password);
    if (result.success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Login correcto',
        detail: `Bienvenido ${result.user.username}`
      });
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 500);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de login',
        detail: result.message || 'Usuario o contraseña incorrectos'
      });
    }
    this.loading = false;
  }
}