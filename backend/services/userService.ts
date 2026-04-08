import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types';

const router = Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// JSON Schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(4),
  first_name: z.string(),
  last_name: z.string(),
});

// LOGIN
router.post('/login', async (req: Request, res: Response) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ success: false, message: 'Datos inválidos', error: parse.error.issues });
  const { email, password } = parse.data;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND is_active = TRUE', [email]);
    if (result.rows.length === 0) return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ success: false, message: 'Email o contraseña incorrectos' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ success: true, message: 'Login exitoso', token, user });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error en login', error: e });
  }
});

// REGISTER
router.post('/register', async (req: Request, res: Response) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) {
    console.log('[REGISTER] Datos inválidos:', parse.error.issues, req.body);
    return res.status(400).json({ success: false, message: 'Datos inválidos', error: parse.error.issues });
  }
  const { username, email, password, first_name, last_name } = parse.data;
  try {
    console.log('[REGISTER] Intentando registrar:', { username, email });
    const existsEmail = await pool.query('SELECT COUNT(*) FROM users WHERE email = $1', [email]);
    console.log('[REGISTER] Resultado email:', existsEmail.rows);
    if (parseInt(existsEmail.rows[0].count) > 0) {
      console.log('[REGISTER] Email ya registrado:', email);
      return res.status(409).json({ success: false, message: 'Email ya registrado' });
    }
    const existsUser = await pool.query('SELECT COUNT(*) FROM users WHERE username = $1', [username]);
    console.log('[REGISTER] Resultado username:', existsUser.rows);
    if (parseInt(existsUser.rows[0].count) > 0) {
      console.log('[REGISTER] Username ya registrado:', username);
      return res.status(409).json({ success: false, message: 'Username ya registrado' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active) VALUES ($1, $2, $3, $4, $5, $6, TRUE) RETURNING id, username, email, first_name, last_name, role, created_at',
      [username, email, password_hash, first_name, last_name, 'user']
    );
    const user = result.rows[0];
    console.log('[REGISTER] Usuario creado:', user);
    res.status(201).json({ success: true, message: 'Usuario registrado', user });
  } catch (e) {
    console.log('[REGISTER] Error en registro:', e);
    res.status(500).json({ success: false, message: 'Error en registro', error: e });
  }
});

// AGREGAR USUARIO (solo admin)
router.post('/add', async (req: Request, res: Response) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ success: false, message: 'Datos inválidos', error: parse.error.issues });
  const { username, email, password, first_name, last_name } = parse.data;
  try {
    const existsEmail = await pool.query('SELECT COUNT(*) FROM users WHERE email = $1', [email]);
    if (parseInt(existsEmail.rows[0].count) > 0) return res.status(409).json({ success: false, message: 'Email ya registrado' });
    const existsUser = await pool.query('SELECT COUNT(*) FROM users WHERE username = $1', [username]);
    if (parseInt(existsUser.rows[0].count) > 0) return res.status(409).json({ success: false, message: 'Username ya registrado' });
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active) VALUES ($1, $2, $3, $4, $5, $6, TRUE) RETURNING id, username, email, first_name, last_name, role, created_at',
      [username, email, password_hash, first_name, last_name, 'user']
    );
    const user = result.rows[0];
    res.status(201).json({ success: true, message: 'Usuario agregado', user });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al agregar usuario', error: e });
  }
});

export default router;
