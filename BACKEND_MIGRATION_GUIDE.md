# Guía de Migración a Backend

## 📋 Descripción
Este documento explica cómo migrar fácilmente el sistema actual de localhost/localStorage a un backend real (Node.js, .NET, Python, etc.).

---

## 🔄 Arquitectura Actual (Sin Backend)

```
┌─────────────────────────────────────────┐
│         Angular Components              │
│  (Login, Groups, Users, Tickets, etc.)  │
└──────────────────┬──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │    Services          │
        │ (User, Group, Ticket │
        │   Reports, Profile)  │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │   localStorage       │
        │  (JSON Data Store)   │
        └──────────────────────┘
```

---

## 🔄 Arquitectura Futura (Con Backend)

```
┌─────────────────────────────────────────┐
│         Angular Components              │
│  (Login, Groups, Users, Tickets, etc.)  │
└──────────────────┬──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │    Services          │
        │ (User, Group, Ticket │
        │   Reports, Profile)  │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │   HTTP Client        │
        │  (REST API Calls)    │
        └────────────┬─────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │   Backend/API Server      │
         │  (Node.js, .NET, Python)  │
         └────────────┬──────────────┘
                      │
                      ▼
         ┌───────────────────────────┐
         │   Database                │
         │ (PostgreSQL, MySQL, etc.) │
         └───────────────────────────┘
```

---

## 🛠 Pasos para Migración

### 1. **Crear Servicios HTTP Wrapper**

Actualmente, los servicios llaman a `localStorage`. Necesitas crear un wrapper que:

```typescript
// src/app/services/http-base.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpBaseService {
  private apiUrl = 'http://localhost:3000/api'; // Tu URL del backend

  constructor(private http: HttpClient) { }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`);
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, data);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, data);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`);
  }
}
```

### 2. **Refactorizar UserService**

**Antes (localStorage):**
```typescript
private loadUsersFromStorage(): User[] {
  const stored = localStorage.getItem(this.STORAGE_KEY);
  return stored ? JSON.parse(stored) : this.getDefaultUsers();
}

getUsers(): Observable<User[]> {
  return this.users$;
}
```

**Después (Backend):**
```typescript
private loadUsersFromApi(): Observable<User[]> {
  return this.http.get<User[]>(`/users`);
}

getUsers(): Observable<User[]> {
  return this.http.get<User[]>(`/users`);
}
```

### 3. **Implementar Endpoints Backend**

Necesitarás crear estos endpoints:

#### **Users API:**
```
GET    /api/users              - Obtener todos los usuarios
GET    /api/users/:id          - Obtener usuario por ID
POST   /api/users              - Crear nuevo usuario
PUT    /api/users/:id          - Actualizar usuario
DELETE /api/users/:id          - Eliminar usuario
POST   /api/auth/login         - Login
POST   /api/auth/logout        - Logout
```

#### **Groups API:**
```
GET    /api/groups             - Obtener todos los grupos
GET    /api/groups/:id         - Obtener grupo por ID
POST   /api/groups             - Crear nuevo grupo
PUT    /api/groups/:id         - Actualizar grupo
DELETE /api/groups/:id         - Eliminar grupo
POST   /api/groups/:id/join    - Unirse al grupo
POST   /api/groups/:id/leave   - Salirse del grupo
```

#### **Tickets API:**
```
GET    /api/tickets            - Obtener todos los tickets
GET    /api/tickets/:id        - Obtener ticket por ID
GET    /api/groups/:id/tickets - Obtener tickets de un grupo
POST   /api/tickets            - Crear nuevo ticket
PUT    /api/tickets/:id        - Actualizar ticket
DELETE /api/tickets/:id        - Eliminar ticket
```

#### **Reports API:**
```
GET    /api/reports/users      - Reporte de usuarios
GET    /api/reports/tickets    - Reporte de tickets
GET    /api/reports/groups     - Reporte de grupos
```

### 4. **Ejemplo Completo - Refactorizar UserService**

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api';
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      tap(users => this.usersSubject.next(users))
    ).subscribe();
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  createUser(user: Omit<User, 'id' | 'createdDate'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user).pipe(
      tap(() => this.loadUsers())
    );
  }

  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, userData).pipe(
      tap(() => this.loadUsers())
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`).pipe(
      tap(() => this.loadUsers())
    );
  }

  login(email: string, password: string): Observable<{ user: User; token: string }> {
    return this.http.post<{ user: User; token: string }>(`${this.apiUrl}/auth/login`, {
      email,
      password
    }).pipe(
      tap(result => {
        localStorage.setItem('auth_token', result.token);
        // Set current user
      })
    );
  }
}
```

### 5. **Agregar HttpClientModule**

En `app.config.ts`:

```typescript
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
    provideHttpClient()
  ]
};
```

### 6. **Implementar Token/JWT Authentication**

```typescript
// src/app/services/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('auth_token');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request);
  }
}
```

---

## 📚 Opciones de Backend Recomendadas

### **Node.js + Express**
```bash
npm install express cors axios
```

Estructura básica:
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.get('/api/users', (req, res) => {
  // Obtener usuarios de DB
});

app.post('/api/users', (req, res) => {
  // Crear usuario
});

app.listen(3000, () => console.log('Server on port 3000'));
```

### **.NET Core**
```csharp
// Controllers/UsersController.cs
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase {
  [HttpGet]
  public IEnumerable<User> GetUsers() { }

  [HttpPost]
  public User CreateUser(CreateUserDto dto) { }
}
```

### **Python + Django/FastAPI**
```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

@app.get("/api/users")
async def get_users():
    # Obtener usuarios de DB
    pass

@app.post("/api/users")
async def create_user(user: UserCreate):
    # Crear usuario
    pass
```

---

## 🔐 Consideraciones de Seguridad

- ✅ Implementar JWT para autenticación
- ✅ Usar HTTPS en producción
- ✅ Validar datos en servidor y cliente
- ✅ Hash de contraseñas con bcrypt o similar
- ✅ CORS configurado correctamente
- ✅ Rate limiting
- ✅ Validación de permisos en servidor

---

## 📊 Base de Datos Sugerida

### **Estructura de Tablas:**

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  phone VARCHAR(20),
  address TEXT,
  birth_date DATE,
  role VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP
);

-- Groups
CREATE TABLE groups (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  level VARCHAR(50),
  author UUID REFERENCES users(id),
  member_count INT DEFAULT 0,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets
CREATE TABLE tickets (
  id UUID PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(50),
  priority VARCHAR(50),
  assigned_to UUID REFERENCES users(id),
  group_id UUID REFERENCES groups(id),
  creator UUID REFERENCES users(id),
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deadline DATE
);

-- Permissions
CREATE TABLE permissions (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  category VARCHAR(50)
);

-- User Permissions
CREATE TABLE user_permissions (
  user_id UUID REFERENCES users(id),
  permission_id VARCHAR(50) REFERENCES permissions(id),
  PRIMARY KEY (user_id, permission_id)
);
```

---

## ✅ Checklist de Migración

- [ ] Crear HttpBaseService
- [ ] Refactorizar UserService a HTTP
- [ ] Refactorizar GroupService a HTTP
- [ ] Refactorizar TicketService a HTTP
- [ ] Refactorizar ReportService a HTTP
- [ ] Implementar AuthInterceptor
- [ ] Crear backend API
- [ ] Implementar database
- [ ] Configurar CORS
- [ ] Implementar autenticación JWT
- [ ] Testing completo
- [ ] Desplegar en producción

---

## 📝 Notas Finales

- La estructura Angular actual ya soporta esta migración
- Los componentes no necesitan cambios mayores
- Solo necesitas cambiar cómo los servicios obtienen datos
- El backend es independiente del frontend

Puedes mantener la lógica de caché local en los servicios para mejor UX mientras haces las llamadas al backend en background.

---

Creado: 2026-03-11 | Lista para migración cuando esté listo
