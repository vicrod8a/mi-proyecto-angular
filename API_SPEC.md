# 🔐 Especificación Técnica - Auth & User Management
## Backend API - mi-proyecto

---

## 1️⃣ LOGIN

### Endpoint
```
POST /api/auth/login
```

### Query SQL
```sql
SELECT id, username, email, password_hash, first_name, last_name, role, is_active
FROM users 
WHERE email = $1 AND is_active = TRUE;
```

### Request Body
```json
{
  "email": "user@example.com",
  "password": "plaintext_password"
}
```

### Process
1. Recibir email/password
2. Ejecutar query con email
3. Si no existe → Error 401 "Usuario no encontrado"
4. Si existe → Comparar password_hash con bcrypt
5. Si coincide → Generar JWT
6. Retornar token + user data

### Response Success (200)
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "juan",
    "email": "user@example.com",
    "first_name": "Juan",
    "last_name": "García",
    "role": "super_admin",
    "created_at": "2026-03-22T10:30:00Z"
  }
}
```

### Response Error (401)
```json
{
  "success": false,
  "message": "Email o contraseña incorrectos"
}
```

---

## 2️⃣ REGISTER USER

### Endpoint
```
POST /api/auth/register
```

### Queries SQL
```sql
-- Verificar email
SELECT COUNT(*) as exists FROM users WHERE email = $1;

-- Verificar username
SELECT COUNT(*) as exists FROM users WHERE username = $1;

-- Crear usuario
INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active)
VALUES ($1, $2, $3, $4, $5, $6, TRUE)
RETURNING id, username, email, first_name, last_name, role, created_at;
```

### Request Body
```json
{
  "username": "juan_new",
  "email": "juan@example.com",
  "password": "SecurePass@123",
  "first_name": "Juan",
  "last_name": "García"
}
```

### Process
1. Validar que email no existe
2. Si existe → Error 409 "Email ya registrado"
3. Validar que username no existe
4. Si existe → Error 409 "Username ya existe"
5. Hash la contraseña con bcrypt
6. Insertar usuario con role = "user" (default)
7. Retornar usuario creado

### Response Success (201)
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 5,
    "username": "juan_new",
    "email": "juan@example.com",
    "first_name": "Juan",
    "last_name": "García",
    "role": "user",
    "created_at": "2026-03-23T14:20:00Z"
  }
}
```

### Response Error (409)
```json
{
  "success": false,
  "message": "Email ya está registrado"
}
```

---

## 3️⃣ UPDATE USER PROFILE

### Endpoint
```
PUT /api/users/:id/profile
```

### Query SQL
```sql
UPDATE users 
SET 
  first_name = $1, 
  last_name = $2, 
  phone = $3, 
  address = $4, 
  birth_date = $5, 
  avatar_url = $6, 
  updated_at = CURRENT_TIMESTAMP
WHERE id = $7 AND is_active = TRUE
RETURNING id, username, email, first_name, last_name, phone, address, birth_date, avatar_url, updated_at;
```

### Request Body
```json
{
  "first_name": "Juan Carlos",
  "last_name": "García López",
  "phone": "+34 612345678",
  "address": "Calle Principal 123, Madrid",
  "birth_date": "1990-03-15",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

### Process
1. Verificar que user_id del JWT coincida con :id
2. Si no coincide → Error 403 "No autorizado"
3. Validar datos (opcional validar formato de datos)
4. Ejecutar UPDATE
5. Retornar perfil actualizado

### Response Success (200)
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "user": {
    "id": 1,
    "username": "juan",
    "email": "juan@example.com",
    "first_name": "Juan Carlos",
    "last_name": "García López",
    "phone": "+34 612345678",
    "address": "Calle Principal 123, Madrid",
    "birth_date": "1990-03-15",
    "avatar_url": "https://example.com/avatar.jpg",
    "updated_at": "2026-03-23T15:45:30Z"
  }
}
```

### Response Error (403)
```json
{
  "success": false,
  "message": "No tienes permiso para actualizar este perfil"
}
```

---

## 4️⃣ UPDATE PASSWORD

### Endpoint
```
PUT /api/users/:id/password
```

### Queries SQL
```sql
-- Obtener hash actual
SELECT password_hash FROM users WHERE id = $1 AND is_active = TRUE;

-- Actualizar password
UPDATE users 
SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2 AND is_active = TRUE
RETURNING id, username, email;
```

### Request Body
```json
{
  "old_password": "OldPass@123",
  "new_password": "NewSecurePass@456"
}
```

### Process
1. Verificar que user_id del JWT coincida con :id
2. Si no coincide → Error 403
3. Obtener password_hash actual
4. Comparar old_password con hash (bcrypt)
5. Si no coincide → Error 401 "Contraseña actual incorrecta"
6. Hash new_password
7. Ejecutar UPDATE
8. Limpiar sesiones/tokens antiguos (opcional)
9. Retornar confirmación

### Response Success (200)
```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente",
  "user": {
    "id": 1,
    "username": "juan",
    "email": "juan@example.com"
  }
}
```

### Response Error (401)
```json
{
  "success": false,
  "message": "Contraseña actual incorrecta"
}
```

---

## 5️⃣ ASSIGN PERMISSION / CHANGE ROLE

### Endpoint
```
PUT /api/users/:id/role
PUT /api/admin/users/:id/assign-permission
```

### Queries SQL
```sql
-- Obtener rol actual
SELECT role FROM users WHERE id = $1 AND is_active = TRUE;

-- Obtener todos los roles
SELECT id, name, description FROM roles ORDER BY name;

-- Cambiar rol
UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2 AND is_active = TRUE
RETURNING id, username, email, role;

-- Obtener permisos del nuevo rol
SELECT DISTINCT p.id, p.name, p.description
FROM permissions p
JOIN role_permissions rp ON p.id = rp.permission_id
WHERE rp.role_id = $1 ORDER BY p.name;
```

### Request Body
```json
{
  "role": "admin"
}
```

### Process
1. Verificar que usuario actual tiene permiso "user.manage"
2. Si no → Error 403 "No autorizado para asignar permisos"
3. Validar que el nuevo role existe
4. Si no existe → Error 400 "Role inválido"
5. Ejecutar UPDATE con nuevo role
6. Obtener permisos del nuevo rol
7. Retornar confirmación

### Response Success (200)
```json
{
  "success": true,
  "message": "Rol asignado exitosamente",
  "user": {
    "id": 3,
    "username": "carlos",
    "email": "carlos@example.com",
    "role": "admin"
  },
  "permissions": [
    {
      "id": 1,
      "name": "ticket.create",
      "description": "Crear tickets"
    },
    {
      "id": 2,
      "name": "ticket.read",
      "description": "Ver tickets"
    },
    {
      "id": 3,
      "name": "ticket.update",
      "description": "Editar tickets"
    }
  ]
}
```

### Response Error (403)
```json
{
  "success": false,
  "message": "No tienes permisos para asignar roles"
}
```

---

## 🔒 VALIDACIONES & SEGURIDAD

### Validaciones Requeridas

**Email:**
- No vacío
- Formato válido (RFC 5322)
- No duplicado en BD

**Username:**
- 3-30 caracteres
- Solo alfanuméricos y guiones bajos
- No duplicado en BD

**Password:**
- Mínimo 8 caracteres
- Al menos 1 mayúscula
- Al menos 1 minúscula
- Al menos 1 número
- Al menos 1 carácter especial (@, #, $, %, etc.)

**Phone:**
- Opcional
- Máximo 20 caracteres

**Birth Date:**
- Opcional
- Formato YYYY-MM-DD
- No puede ser fecha futura

### Hashing de Contraseñas
```
Saltear y hashear con bcrypt
- Rounds: 10
- Nunca almacenar contraseña en texto plano
```

### Tokens JWT
```
- Algoritmo: HS256
- Expiración: 7 días (7d)
- Refresh Token: 30 días (opcional)
- Claims: id, username, email, role
```

### Autorización

**Para UPDATE PROFILE:**
- Solo el usuario mismo O
- Super admin

**Para UPDATE PASSWORD:**
- Solo el usuario mismo

**Para ASSIGN ROLE:**
- Requerido: permiso "user.manage"
- Típicamente: super_admin o admin

---

## 📊 Roles Predefinidos

| Role | Permisos |
|------|----------|
| super_admin | Todos |
| admin | ticket.*, group.read, group.manage, user.read, report.read |
| user | ticket.create, ticket.read, ticket.update, group.read, report.read |
| viewer | ticket.read, group.read, report.read |

---

## 🧪 Casos de Prueba

### Login
- ✅ Email correcto + password correcto
- ❌ Email no existe
- ❌ Password incorrecta
- ❌ Usuario desactivado (is_active = FALSE)

### Register
- ✅ Datos válidos completos
- ❌ Email ya registrado
- ❌ Username ya existe
- ❌ Password débil
- ❌ Email inválido

### Update Profile
- ✅ Actualizar todos los campos
- ✅ Actualizar solo algunos campos
- ❌ Usuario no autorizado
- ❌ ID de usuario no existe

### Update Password
- ✅ Contraseña actual correcta y nueva válida
- ❌ Contraseña actual incorrecta
- ❌ Nueva contraseña débil
- ❌ Usuario no autorizado

### Assign Role
- ✅ Admin cambia rol de otro usuario
- ❌ Usuario normal intenta cambiar rol
- ❌ Role inválido
- ❌ Super admin intenta cambiar su propio rol

