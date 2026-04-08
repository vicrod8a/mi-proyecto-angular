# 🏗️ Arquitectura Backend - mi-proyecto

## Estructura de Carpetas

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Conexión PostgreSQL
│   │   ├── jwt.ts               # Configuración JWT
│   │   └── env.ts               # Variables de entorno
│   │
│   ├── middleware/
│   │   ├── auth.ts              # Middleware de autenticación
│   │   ├── errorHandler.ts      # Manejador de errores
│   │   └── validators.ts        # Validaciones
│   │
│   ├── controllers/
│   │   ├── authController.ts    # Login, Register
│   │   ├── userController.ts    # Profile, Password, Permissions
│   │   └── types.ts             # Tipos específicos del controller
│   │
│   ├── services/
│   │   ├── authService.ts       # Lógica de autenticación
│   │   ├── userService.ts       # Lógica de usuarios
│   │   └── types.ts             # Tipos específicos del servicio
│   │
│   ├── repositories/
│   │   ├── userRepository.ts    # Queries a BD (users)
│   │   ├── roleRepository.ts    # Queries a BD (roles/permissions)
│   │   └── types.ts             # Tipos de retorno
│   │
│   ├── utils/
│   │   ├── crypto.ts            # Bcrypt, JWT tokens
│   │   ├── validators.ts        # Validaciones (email, password, etc)
│   │   └── logger.ts            # Logging
│   │
│   ├── routes/
│   │   ├── auth.ts              # Rutas de autenticación
│   │   ├── users.ts             # Rutas de usuarios
│   │   └── index.ts             # Registrar todas las rutas
│   │
│   ├── types/
│   │   └── index.ts             # Tipos globales (exports de backend/types.ts)
│   │
│   └── server.ts                # Entry point
│
├── .env.example                 # Variables de entorno (template)
├── .env                         # Variables de entorno (local, NO COMMITAR)
├── package.json
├── tsconfig.json
└── README.md
```

## 🔄 Flujo de Datos

### Ejemplo: LOGIN

```
1. Cliente
   POST /api/auth/login
   { email, password }
        ↓
2. Route Handler (routes/auth.ts)
   app.post('/api/auth/login', validateLoginRequest, authController.login)
        ↓
3. Middleware (middleware/validators.ts)
   ✓ Validar formato email
   ✓ Validar contraseña no vacía
        ↓
4. Controller (controllers/authController.ts)
   - Procesar request
   - Llamar a authService.login()
        ↓
5. Service (services/authService.ts)
   - Validaciones de negocio
   - Llamar a userRepository.getUserByEmail()
   - Comparar passwords con bcrypt
   - Generar JWT token
   - Retornar { token, user }
        ↓
6. Repository (repositories/userRepository.ts)
   - Ejecutar: SELECT id, username, email, password_hash, role, is_active
              FROM users WHERE email = $1 AND is_active = TRUE
   - Retornar resultado o null
        ↓
7. BD (PostgreSQL)
        ↓
8. Response
   { success: true, token, user }
        ↓
9. Cliente recibe JWT en localStorage
```

## 📦 Capas de Responsabilidad

### Routes
- ✅ Define endpoints
- ✅ Aplica middlewares
- ❌ SIN lógica de negocio

### Controller
- ✅ Procesa request/response
- ✅ Llama al service
- ✅ Maneja errores
- ❌ SIN queries a BD
- ❌ SIN lógica compleja

### Service
- ✅ Lógica de negocio
- ✅ Validaciones pasadas
- ✅ Llama a repositories
- ✅ Encripta/Tokens
- ❌ SIN SQL directo

### Repository
- ✅ Queries parametrizadas
- ✅ Retorna datos crudos
- ❌ SIN lógica de negocio
- ❌ SIN transformaciones

### Middleware
- ✅ Verificar tokens JWT
- ✅ Validar permisos
- ✅ Manejo de errores
- ❌ SIN lógica de negocio

## 🛡️ Seguridad en Cada Capa

### Middleware (Validación rápida)
```typescript
// Validar estructura básica
if (!email || !password) {
  return res.status(400).json({ error: 'Campos requeridos' });
}
```

### Controller (Validación formato)
```typescript
// Validar formato antes de procesar
const { valid, errors } = isValidEmail(email);
if (!valid) {
  return res.status(400).json({ errors });
}
```

### Service (Lógica & Seguridad)
```typescript
// Consulta segura con bcrypt y tokens
const user = await userRepository.getUserByEmail(email);
if (!user || !await bcrypt.compare(password, user.password_hash)) {
  // NO decir qué es incorrecto
  throw new AuthError(401, 'Credenciales inválidas');
}
```

### Repository (SQL Prevenida)
```typescript
// Siempre parametrizadas - NUNCA concatenar strings
const result = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]  // Parámetro seguro
);
```

## 🔀 Error Handling

```
Try-Catch en cada nivel
     ↓
Validación Input → Controller
     ↓
Lógica de negocio → Service
     ↓
Queries → Repository
     ↓
Formatear Error
     ↓
Enviar Response con código HTTP apropiado
```

## 🗂️ Archivo .env

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mi_proyecto
DB_USER=postgres
DB_PASSWORD=vic170997

# JWT
JWT_SECRET=your-super-secret-key-here-change-in-production
JWT_EXPIRATION=7d

# Server
PORT=3000
NODE_ENV=development

# Logging
LOG_LEVEL=info
```

## 🚀 Dependencias del Backend

```json
{
  "dependencies": {
    "express": "^4.18.2",           // Framework HTTP
    "pg": "^8.11.3",                 // Driver PostgreSQL
    "cors": "^2.8.5",                // CORS
    "dotenv": "^16.4.5",             // Variables de entorno
    "bcryptjs": "^2.4.3",            // Hash de passwords
    "jsonwebtoken": "^9.1.2",        // JWT tokens
    "express-validator": "^7.0.0"    // Validaciones
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.6",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.7",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0"
  }
}
```

## 📝 Inicialización

1. **Crear archivo .env**
   ```
   cp .env.example .env
   # Editar con tus valores
   ```

2. **Instalar dependencias**
   ```
   npm install
   ```

3. **Compilar TypeScript**
   ```
   npm run build
   ```

4. **Iniciar en desarrollo**
   ```
   npm run dev
   ```

