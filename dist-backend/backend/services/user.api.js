"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.loginSchema = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const pg_1 = require("pg");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
// JSON Schemas
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(4),
});
exports.registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(4),
    first_name: zod_1.z.string(),
    last_name: zod_1.z.string(),
});
// LOGIN
router.post('/login', async (req, res) => {
    const parse = exports.loginSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ success: false, message: 'Datos inválidos', error: parse.error.issues });
    const { email, password } = parse.data;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1 AND is_active = TRUE', [email]);
        if (result.rows.length === 0)
            return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
        const user = result.rows[0];
        const valid = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!valid)
            return res.status(401).json({ success: false, message: 'Email o contraseña incorrectos' });
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        const userResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar_url: user.avatar_url,
            phone: user.phone,
            address: user.address,
            birth_date: user.birth_date,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
        res.json({ success: true, message: 'Login exitoso', token, user: userResponse });
    }
    catch (e) {
        res.status(500).json({ success: false, message: 'Error en login', error: e });
    }
});
// REGISTER
router.post('/register', async (req, res) => {
    const parse = exports.registerSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ success: false, message: 'Datos inválidos', error: parse.error.issues });
    const { username, email, password, first_name, last_name } = parse.data;
    try {
        const existsEmail = await pool.query('SELECT COUNT(*) FROM users WHERE email = $1', [email]);
        if (parseInt(existsEmail.rows[0].count) > 0)
            return res.status(409).json({ success: false, message: 'Email ya registrado' });
        const existsUser = await pool.query('SELECT COUNT(*) FROM users WHERE username = $1', [username]);
        if (parseInt(existsUser.rows[0].count) > 0)
            return res.status(409).json({ success: false, message: 'Username ya registrado' });
        const password_hash = await bcryptjs_1.default.hash(password, 10);
        const result = await pool.query('INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active) VALUES ($1, $2, $3, $4, $5, $6, TRUE) RETURNING id, username, email, first_name, last_name, avatar_url, phone, address, birth_date, role, created_at, updated_at', [username, email, password_hash, first_name, last_name, 'user']);
        const user = result.rows[0];
        const userResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar_url: user.avatar_url,
            phone: user.phone,
            address: user.address,
            birth_date: user.birth_date,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
        res.status(201).json({ success: true, message: 'Usuario registrado', user: userResponse });
    }
    catch (e) {
        res.status(500).json({ success: false, message: 'Error en registro', error: e });
    }
});
// AGREGAR USUARIO (solo admin)
router.post('/add', async (req, res) => {
    const parse = exports.registerSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ success: false, message: 'Datos inválidos', error: parse.error.issues });
    const { username, email, password, first_name, last_name } = parse.data;
    try {
        const existsEmail = await pool.query('SELECT COUNT(*) FROM users WHERE email = $1', [email]);
        if (parseInt(existsEmail.rows[0].count) > 0)
            return res.status(409).json({ success: false, message: 'Email ya registrado' });
        const existsUser = await pool.query('SELECT COUNT(*) FROM users WHERE username = $1', [username]);
        if (parseInt(existsUser.rows[0].count) > 0)
            return res.status(409).json({ success: false, message: 'Username ya registrado' });
        const password_hash = await bcryptjs_1.default.hash(password, 10);
        const result = await pool.query('INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active) VALUES ($1, $2, $3, $4, $5, $6, TRUE) RETURNING id, username, email, first_name, last_name, avatar_url, phone, address, birth_date, role, created_at, updated_at', [username, email, password_hash, first_name, last_name, 'user']);
        const user = result.rows[0];
        const userResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar_url: user.avatar_url,
            phone: user.phone,
            address: user.address,
            birth_date: user.birth_date,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
        res.status(201).json({ success: true, message: 'Usuario agregado', user: userResponse });
    }
    catch (e) {
        res.status(500).json({ success: false, message: 'Error al agregar usuario', error: e });
    }
});
exports.default = router;
