"use strict";
/**
 * Tipos y Constantes para Backend
 * mi-proyecto - Auth & User Management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.AuthError = exports.BCRYPT_ROUNDS = exports.PASSWORD_REQUIREMENTS = exports.JWT_CONFIG = exports.PERMISSIONS = exports.ROLES = void 0;
exports.isValidEmail = isValidEmail;
exports.isValidPassword = isValidPassword;
exports.isValidUsername = isValidUsername;
exports.isValidPhone = isValidPhone;
exports.isValidBirthDate = isValidBirthDate;
exports.userDBToResponse = userDBToResponse;
// ========================================
// CONSTANTES
// ========================================
exports.ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    USER: 'user',
    VIEWER: 'viewer'
};
exports.PERMISSIONS = {
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
};
exports.JWT_CONFIG = {
    SECRET: process.env.JWT_SECRET || 'tu-secret-key-aqui',
    EXPIRATION: '7d',
    REFRESH_EXPIRATION: '30d'
};
exports.PASSWORD_REQUIREMENTS = {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
    SPECIAL_CHARS: '@#$%!&*'
};
exports.BCRYPT_ROUNDS = 10;
// ========================================
// ERRORES PERSONALIZADOS
// ========================================
class AuthError extends Error {
    statusCode;
    code;
    constructor(statusCode, message, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = 'AuthError';
    }
}
exports.AuthError = AuthError;
class ValidationError extends Error {
    field;
    value;
    constructor(field, message, value) {
        super(`${field}: ${message}`);
        this.field = field;
        this.value = value;
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
// ========================================
// VALIDACIONES
// ========================================
/**
 * Validar formato de email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Validar que password cumple requisitos
 */
function isValidPassword(password) {
    const errors = [];
    if (password.length < exports.PASSWORD_REQUIREMENTS.MIN_LENGTH) {
        errors.push(`Mínimo ${exports.PASSWORD_REQUIREMENTS.MIN_LENGTH} caracteres`);
    }
    if (exports.PASSWORD_REQUIREMENTS.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
        errors.push('Debe contener al menos 1 mayúscula');
    }
    if (exports.PASSWORD_REQUIREMENTS.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
        errors.push('Debe contener al menos 1 minúscula');
    }
    if (exports.PASSWORD_REQUIREMENTS.REQUIRE_NUMBER && !/\d/.test(password)) {
        errors.push('Debe contener al menos 1 número');
    }
    if (exports.PASSWORD_REQUIREMENTS.REQUIRE_SPECIAL && !new RegExp(`[${exports.PASSWORD_REQUIREMENTS.SPECIAL_CHARS}]`).test(password)) {
        errors.push(`Debe contener al menos 1 carácter especial (${exports.PASSWORD_REQUIREMENTS.SPECIAL_CHARS})`);
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
/**
 * Validar username
 */
function isValidUsername(username) {
    const errors = [];
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
function isValidPhone(phone) {
    if (!phone)
        return true;
    return phone.length <= 20 && /^[\d\s\-\+\(\)]+$/.test(phone);
}
/**
 * Validar fecha de nacimiento
 */
function isValidBirthDate(dateStr) {
    if (!dateStr)
        return true;
    const date = new Date(dateStr);
    if (isNaN(date.getTime()))
        return false;
    // No puede ser fecha futura
    if (date > new Date())
        return false;
    // No puede ser más de 120 años
    const age = new Date().getFullYear() - date.getFullYear();
    if (age > 120)
        return false;
    return true;
}
/**
 * Convertir UserDB a UserResponse
 */
function userDBToResponse(user) {
    const { password_hash, ...rest } = user;
    return rest;
}
