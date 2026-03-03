import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

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
    ToastModule,
    CheckboxModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  loading = false;

  // 🔐 Credenciales hardcodeadas
  private readonly HARDCODED_EMAIL = 'admin@test.com';
  private readonly HARDCODED_PASSWORD = 'Admin@12345';

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit() {
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

    // Simular delay de API
    setTimeout(() => {
      if (email === this.HARDCODED_EMAIL && password === this.HARDCODED_PASSWORD) {
        this.messageService.add({
          severity: 'success',
          summary: 'Login correcto',
          detail: 'Bienvenido al sistema'
        });

        // Opcional: redirigir
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);

      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Credenciales incorrectas',
          detail: 'Email o contraseña incorrectos'
        });
      }
      this.loading = false;
    }, 1000);
  }
}