"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAddSchema = exports.userLoginSchema = exports.userRegisterSchema = void 0;
const express_1 = require("express");
const pg_1 = require("pg");
const zod_1 = require("zod");
// JSON Schemas (Zod)
exports.userRegisterSchema = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password_hash: zod_1.z.string().min(4),
    full_name: zod_1.z.string(),
});
exports.userLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password_hash: zod_1.z.string().min(4),
});
exports.userAddSchema = exports.userRegisterSchema.extend({
// For admin adding users, can set isactive, role, etc.
});
const router = (0, express_1.Router)();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
// LOGIN
router.post('/login', async (req, res) => {
    const parse = exports.userLoginSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.issues });
    const { email, password_hash } = parse.data;
    try {
        const result = await pool.query('SELECT id, username, email, password_hash FROM users WHERE email = $1 AND password_hash = $2 AND is_active = TRUE', [email, password_hash]);
        if (result.rows.length === 0)
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        const user = result.rows[0];
        res.json({ user });
    }
    catch (e) {
        res.status(500).json({ error: 'Error en login', details: e });
    }
});
// REGISTER
router.post('/register', async (req, res) => {
    const parse = exports.userRegisterSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.issues });
    const { username, email, password_hash, full_name } = parse.data;
    try {
        const result = await pool.query(`INSERT INTO users (username, email, password_hash, full_name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (username) DO NOTHING
       RETURNING id, username, email;`, [username, email, password_hash, full_name]);
        if (result.rows.length === 0)
            return res.status(409).json({ error: 'Usuario ya existe' });
        const user = result.rows[0];
        res.status(201).json({ user });
    }
    catch (e) {
        res.status(500).json({ error: 'Error en registro', details: e });
    }
});
// AGREGAR USER (admin)
router.post('/add', async (req, res) => {
    const parse = exports.userAddSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.issues });
    const { username, email, password_hash, full_name } = parse.data;
    try {
        const result = await pool.query(`INSERT INTO users (username, email, password_hash, full_name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (username) DO NOTHING
       RETURNING id, username, email;`, [username, email, password_hash, full_name]);
        if (result.rows.length === 0)
            return res.status(409).json({ error: 'Usuario ya existe' });
        const user = result.rows[0];
        res.status(201).json({ user });
    }
    catch (e) {
        res.status(500).json({ error: 'Error al agregar usuario', details: e });
    }
});
exports.default = router;
