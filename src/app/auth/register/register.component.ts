import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[!@#$%&*?]).{10,}$/)
      ]],
      confirmPassword: ['', Validators.required],
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],
      birthDate: ['', Validators.required]
    }, { validators: [this.passwordMatchValidator, this.ageValidator] });
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  ageValidator(form: AbstractControl): ValidationErrors | null {
    const birthDate = form.get('birthDate')?.value;
    if (!birthDate) return null;

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age >= 18 ? null : { underAge: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores de validación
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });

      this.messageService.add({
        severity: 'error',
        summary: 'Formulario inválido',
        detail: 'Por favor, revisa todos los campos requeridos'
      });
      return;
    }
    const payload = this.registerForm.value;
    // Llamar al API a través del servicio de usuario inyectado
    this.userService.register({
      username: payload.username,
      email: payload.email,
      password: payload.password,
      fullName: payload.fullName,
      address: payload.address,
      phone: payload.phone,
      birthdate: payload.birthDate
    }).then((res: any) => {
      if (res.success) {
        this.messageService.add({ severity: 'success', summary: 'Registro exitoso', detail: 'Cuenta creada correctamente. Redirigiendo al inicio de sesión...' });
        this.registerForm.reset();
        setTimeout(() => this.router.navigate(['/auth/login']), 1200);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Registro fallido', detail: res.message || 'No se pudo crear la cuenta' });
      }
    }).catch((err: any) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.message || String(err) });
    });
  }
}