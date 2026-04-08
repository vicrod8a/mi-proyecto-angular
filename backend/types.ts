/**
 * Tipos y Constantes para Backend
 * mi-proyecto - Auth & User Management
 */

// ========================================
// CONSTANTES
// ========================================

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  USER: 'user',
  VIEWER: 'viewer'
} as const;

export const PERMISSIONS = {
  // Tickets
  TICKET_CREATE: 'ticket.create',
  TICKET_READ: 'ticket.read',
  TICKET_UPDATE: 'ticket.update',
  TICKET_DELETE: 'ticket.delete',
  
  // Groups
  GROUP_CREATE: 'group.create',
  GROUP_READ: 'group.read',
  GROUP_MANAGE: 'group.manage',
  
  // Users
  USER_READ: 'user.read',
  USER_MANAGE: 'user.manage',
  
  // Reports
  REPORT_READ: 'report.read'
} as const;

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'tu-secret-key-aqui',
  EXPIRATION: '7d',
  REFRESH_EXPIRATION: '30d'
} as const;

export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL: true,
  SPECIAL_CHARS: '@#$%!&*'
} as const;

export const BCRYPT_ROUNDS = 10;

// ========================================
// TIPOS
// ========================================

/**
 * Rol del usuario
 */
export type Role = typeof ROLES[keyof typeof ROLES];

/**
 * Permiso del sistema
 */
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Datos de usuario en base de datos
 */
export interface UserDB {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  birth_date: Date | null;
  role: Role;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Usuario enviado al cliente (sin password_hash)
 */
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  birth_date: Date | null;
  role: Role;
  created_at: Date;
  updated_at: Date;
}

/**
 * Payload del JWT
 */
export interface JWTPayload {
  id: number;
  username: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

/**
 * Request actualizar perfil
 */
export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  birth_date?: string; // YYYY-MM-DD
  avatar_url?: string;
}

/**
 * Request cambiar contraseña
 */
export interface UpdatePasswordRequest {
  old_password: string;
  new_password: string;
}

/**
 * Request asignar rol
 */
export interface AssignRoleRequest {
  role: Role;
}

/**
 * Response por defecto
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Response de login/register
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: UserResponse;
  error?: string;
}

/**
 * Response de lista de roles
 */
export interface RoleInfo {
  id: string;
  name: Role;
  description: string;
}

/**
 * Response de lista de permisos
 */
export interface PermissionInfo {
  id: number;
  name: Permission;
  description: string;
}

/**
 * Request login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Request register
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

// ========================================
// INTERFACES PARA REQUEST/RESPONSE COMPLETOS
// ========================================

/**
 * Response del endpoint POST /api/auth/login
 */
export interface LoginResponse extends AuthResponse {
  token?: string;
  user?: UserResponse;
}

/**
 * Response del endpoint POST /api/auth/register
 */
export interface RegisterResponse extends AuthResponse {
  user?: UserResponse;
}

/**
 * Response del endpoint PUT /api/users/:id/profile
 */
export interface UpdateProfileResponse extends ApiResponse {
  data?: UserResponse;
}

/**
 * Response del endpoint PUT /api/users/:id/password
 */
export interface UpdatePasswordResponse extends ApiResponse {
  data?: {
    id: number;
    username: string;
    email: string;
  };
}

/**
 * Response del endpoint PUT /api/users/:id/role
 */
export interface AssignRoleResponse extends ApiResponse {
  data?: {
    user: UserResponse;
    permissions: PermissionInfo[];
  };
}

// ========================================
// ERRORES PERSONALIZADOS
// ========================================

export class AuthError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class ValidationError extends Error {
  constructor(
    public field: string,
    message: string,
    public value?: any
  ) {
    super(`${field}: ${message}`);
    this.name = 'ValidationError';
  }
}

// ========================================
// VALIDACIONES
// ========================================

/**
 * Validar formato de email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validar que password cumple requisitos
 */
export function isValidPassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
    errors.push(`Mínimo ${PASSWORD_REQUIREMENTS.MIN_LENGTH} caracteres`);
  }

  if (PASSWORD_REQUIREMENTS.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos 1 mayúscula');
  }

  if (PASSWORD_REQUIREMENTS.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Debe contener al menos 1 minúscula');
  }

  if (PASSWORD_REQUIREMENTS.REQUIRE_NUMBER && !/\d/.test(password)) {
    errors.push('Debe contener al menos 1 número');
  }

  if (PASSWORD_REQUIREMENTS.REQUIRE_SPECIAL && !new RegExp(`[${PASSWORD_REQUIREMENTS.SPECIAL_CHARS}]`).test(password)) {
    errors.push(`Debe contener al menos 1 carácter especial (${PASSWORD_REQUIREMENTS.SPECIAL_CHARS})`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validar username
 */
export function isValidUsername(username: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (username.length < 3) {
    errors.push('Mínimo 3 caracteres');
  }

  if (username.length > 30) {
    errors.push('Máximo 30 caracteres');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Solo alfanuméricos y guiones bajos permitidos');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validar teléfono
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return true;
  return phone.length <= 20 && /^[\d\s\-\+\(\)]+$/.test(phone);
}

/**
 * Validar fecha de nacimiento
 */
export function isValidBirthDate(dateStr: string): boolean {
  if (!dateStr) return true;

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;

  // No puede ser fecha futura
  if (date > new Date()) return false;

  // No puede ser más de 120 años
  const age = new Date().getFullYear() - date.getFullYear();
  if (age > 120) return false;

  return true;
}

/**
 * Convertir UserDB a UserResponse
 */
export function userDBToResponse(user: UserDB): UserResponse {
  const { password_hash, ...rest } = user;
  return rest;
}
