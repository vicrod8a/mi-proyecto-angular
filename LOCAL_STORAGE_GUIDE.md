# Sistema de Gestión - Funcionalidades Implementadas

## 📋 Descripción General
Este proyecto es una aplicación Angular completa de gestión de grupos, usuarios y tickets que utiliza **localStorage** para persistencia de datos durante la sesión. No requiere backend, todo se maneja localmente.

---

## 🎯 Características Implementadas

### 1. **Gestión de Usuarios**
- ✅ Crear nuevos usuarios con datos completos:
  - Nombre de usuario, email, nombres, apellidos
  - Teléfono, dirección, fecha de nacimiento
  - Avatar, rol y estado (activo/inactivo)
  - Asignación a grupos
  
- ✅ Editar usuarios existentes
- ✅ Eliminar usuarios
- ✅ Sistema de permisos por usuario
- ✅ Login/Logout con email y contraseña
- ✅ Datos persistentes en localStorage (`mi-proyecto-users`)

**Usuarios por defecto:**
- `superAdmin@company.com` / `SuperAdmin@123` - Super Administrator
- `juan.perez@company.com` / `Juan@123` - Developer
- `maria.garcia@company.com` / `Maria@123` - Project Manager
- `carlos.ruiz@company.com` / `Carlos@123` - QA Engineer
- `ana.lopez@company.com` / `Ana@123` - UX Designer

---

### 2. **Gestión de Grupos**
- ✅ Crear nuevos grupos con:
  - Nombre, descripción, nivel de dificultad
  - Contador de miembros automático
  - Autor y fecha de creación
  
- ✅ Editar información del grupo
- ✅ Eliminar grupos
- ✅ Ver grupos disponibles
- ✅ Unirse/Salirse de grupos (actualiza automáticamente membresía)
- ✅ Datos persistentes en localStorage (`mi-proyecto-groups`)

**Grupos por defecto:**
- Equipo Dev, Soporte, UX, QA, Marketing, Ventas

---

### 3. **Gestión de Tickets/Tareas**
- ✅ Crear tickets dentro de grupos con:
  - Título, descripción, estado, prioridad
  - Asignación a usuarios
  - Fecha de creación y deadline
  - Comentarios e historial
  
- ✅ Editar tickets (estado, asignación, prioridad, etc.)
- ✅ Eliminar tickets
- ✅ Ver tickets por grupo
- ✅ Filtrar por:
  - Estado (Pendiente, En progreso, Revisión, Hecho)
  - Prioridad (1-Urgente, 2-Alta, 3-Media, 4-Baja)
  - Asignado a usuario
  
- ✅ Ordenamiento por fecha, prioridad, etc.
- ✅ Datos persistentes en localStorage (`mi-proyecto-tickets`)

**Tickets por defecto:** 10 tickets de prueba en diferentes grupos y estados

---

### 4. **Reportes**
- ✅ Reportes de usuarios:
  - Distribución por rol (gráfico de pastel)
  - Total de usuarios activos

- ✅ Reportes de tickets:
  - Distribución por estado (gráfico de barras)
  - Conteo por prioridad
  - Total de tickets

- ✅ Reportes de grupos:
  - Miembros por grupo
  - Tickets por grupo
  - Estado de tickets por grupo

- ✅ Filtrado de reportes por grupo específico
- ✅ Gráficos interactivos con Chart.js y PrimeNG

---

### 5. **Perfil de Usuario**
- ✅ Ver datos personales del usuario actual:
  - Nombre completo, usuario, email
  - Teléfono, dirección, fecha de nacimiento
  - Avatar, rol, fecha de creación
  
- ✅ Editar perfil personal
- ✅ Ver tickets asignados al usuario
- ✅ Resumen de estado de tickets:
  - Pendiente, En progreso, Revisión, Hecho
  
- ✅ Información de membresía en grupos
- ✅ Datos se actualizan en localStorage automáticamente

---

### 6. **Sistema de Permisos**
- ✅ Permisos por categoría:
  - **Tickets**: crear, leer, actualizar, eliminar
  - **Grupos**: crear, leer, actualizar, eliminar
  - **Usuarios**: crear, leer, actualizar, eliminar
  - **Permisos**: gestionar asignación
  - **Sistema**: admin, reportes
  
- ✅ Roles predefinidos con permisos asociados:
  - Super Administrator (acceso total)
  - Developer (tickets y grupos)
  - Project Manager (lectura especializada)
  - QA Engineer (testing)
  - UX Designer (diseño)

---

## 💾 Persistencia de Datos

### localStorage Keys:
```json
{
  "mi-proyecto-users": "Array de usuarios",
  "mi-proyecto-groups": "Array de grupos",
  "mi-proyecto-tickets": "Array de tickets",
  "mi-proyecto-current-user": "ID del usuario actualmente conectado"
}
```

### Características de Persistencia:
- ✅ Los datos se guardan automáticamente cuando se crean, editan o eliminan
- ✅ Al recargar la página, los datos se restauran desde localStorage
- ✅ Si no hay datos en localStorage, se cargan los datos por defecto
- ✅ Usuario superAdmin se establece automáticamente como usuario por defecto
- ✅ La sesión persiste mientras la pestaña esté abierta

---

## 📱 Interfaz de Usuario

### Componentes Principales:
1. **Sidebar Navigation** - Navegación principal con iconos
2. **Login Page** - Autenticación con email/contraseña
3. **Groups Management** - CRUD completo de grupos
4. **User Management** - CRUD completo de usuarios
5. **Ticket List** - Vista de tabla de tickets con filtros
6. **Ticket Kanban** - Vista de tablero Kanban
7. **Group Dashboard** - Dashboard por grupo
8. **Reports** - Gráficos y estadísticas
9. **User Profile** - Perfil personal editable

---

## 🔐 Seguridad

- ✅ Sistema de autenticación con email/contraseña
- ✅ Control de permisos por usuario
- ✅ Roles y permisos predefinidos
- ✅ Dirección basada en permisos
- ✅ Usuario por defecto establecido al iniciar

**Nota:** Este es un sistema de demostración. Para producción, se debe implementar un backend con autenticación real.

---

## 🚀 Cómo Usar

### Iniciar Sesión (Opcional):
- La app carga automáticamente como `superAdmin`
- O ve a Login y usa: `admin@company.com` / `SuperAdmin@123`

### Crear Grupo:
1. Ve a "Grupos" en el menú
2. Completa el formulario (nombre, descripción, nivel)
3. Click en "Crear Grupo"
4. Los datos se guardan automáticamente en localStorage

### Crear Usuario:
1. Ve a "Usuarios" en el menú
2. Click en "Nuevo Usuario"
3. Completa todos los datos
4. Los datos se guardan automáticamente

### Crear Ticket:
1. Ve a un grupo específico
2. Click en "Crear Ticket"
3. Completa el formulario (título, descripción, asignado, prioridad)
4. Los datos se guardan automáticamente

### Ver Reportes:
1. Ve a "Reportes" en el menú
2. Selecciona el tipo (usuarios, tickets, grupos)
3. Los gráficos se generan en tiempo real

### Ver Perfil:
1. Ve a "Mi Perfil" en el menú
2. Ve tus datos personales
3. Click en "Editar Perfil" para cambiar datos
4. Los cambios se guardan automáticamente

---

## 📊 Datos de Prueba

El sistema viene con:
- **5 usuarios** de diferentes roles
- **6 grupos** principales
- **10 tickets** distribuidos en los grupos
- **Permisos** configurados por rol

Todos los datos de prueba se pueden editar, eliminar o expandir según sea necesario.

---

## 🛠 Tecnologías Usadas

- **Angular 20** - Framework principal
- **RxJS** - Manejo reactivo de datos
- **PrimeNG** - Componentes UI profesionales
- **Chart.js** - Gráficos de reportes
- **Tailwind CSS** - Estilos
- **localStorage** - Persistencia de datos

---

## 📝 Notas Importantes

1. **Sin Backend**: Todo funciona localmente con localStorage
2. **Datos Persistentes**: Se guardan durante toda la sesión
3. **Usuario Por Defecto**: Se establece automáticamente al iniciar
4. **Escalable**: Fácil de conectar a un backend real
5. **Datos en JSON**: Toda la estructura está en JSON, compatible con cualquier backend

---

## ✅ Todos los Requisitos Completos

✅ Grupos se crean y guardan en localStorage  
✅ Usuarios existen y se guardan  
✅ Tickets se guardan y relacionan con vistas  
✅ Reportes muestran datos reales  
✅ Perfil muestra datos reales del usuario  
✅ Todo se guarda en JSON (localStorage)  
✅ Aún no es backend - todo es local

---

Creado: 2026-03-11 | Sistema lista para demostración y expansión
