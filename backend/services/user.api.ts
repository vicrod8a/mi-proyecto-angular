import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginRequest, RegisterRequest, AuthResponse, UserResponse } from '../types.ts';

const router = Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// JSON Schemas
export const loginSchema = z
  .object({
    identifier: z.string().min(1).optional(), // legacy field
    email: z.string().email().optional(),
    password: z.string().min(4),
  })
  .refine((d) => !!(d.identifier || d.email), { message: 'identifier or email required', path: ['identifier'] });

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
  if (!parse.success) return res.status(400).json({ statusCode: 400, intOpCode: 'SxUS400', data: { message: 'Datos inválidos', error: parse.error.issues } });
  // accept identifier or email, but match only by email (no username lookup)
  const email = (parse.data as any).identifier || (parse.data as any).email;
  const password = (parse.data as any).password;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND is_active = TRUE', [email]);
    if (result.rows.length === 0) return res.status(401).json({ statusCode: 401, intOpCode: 'SxUS401', data: { message: 'Usuario no encontrado' } });
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ statusCode: 401, intOpCode: 'SxUS401', data: { message: 'Email o contraseña incorrectos' } });
    const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    const userResponse: UserResponse = {
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
    res.status(200).json({ statusCode: 200, intOpCode: 'SxUS200', data: { token, user: userResponse } });
  } catch (e) {
    res.status(500).json({ statusCode: 500, intOpCode: 'SxUS500', data: { message: 'Error en login', error: e } });
  }
});

// REGISTER
router.post('/register', async (req: Request, res: Response) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ statusCode: 400, intOpCode: 'SxUS400', data: { message: 'Datos inválidos', error: parse.error.issues } });
  const { username, email, password, first_name, last_name } = parse.data;
  try {
    console.log('Intentando registrar usuario:', { username, email, first_name, last_name });
    const existsEmail = await pool.query('SELECT COUNT(*) FROM users WHERE email = $1', [email]);
    console.log('Resultado existsEmail:', existsEmail.rows);
    if (parseInt(existsEmail.rows[0].count) > 0) {
      console.log('Email ya registrado');
      return res.status(409).json({ statusCode: 409, intOpCode: 'SxUS409', data: { message: 'Email ya registrado' } });
    }
    const existsUser = await pool.query('SELECT COUNT(*) FROM users WHERE username = $1', [username]);
    console.log('Resultado existsUser:', existsUser.rows);
    if (parseInt(existsUser.rows[0].count) > 0) {
      console.log('Username ya registrado');
      return res.status(409).json({ statusCode: 409, intOpCode: 'SxUS409', data: { message: 'Username ya registrado' } });
    }
    const password_hash = await bcrypt.hash(password, 10);
    console.log('Password hash generado:', password_hash);
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active) VALUES ($1, $2, $3, $4, $5, $6, TRUE) RETURNING id, username, email, first_name, last_name, avatar_url, phone, address, birth_date, role, created_at, updated_at',
      [username, email, password_hash, first_name, last_name, 'user']
    );
    console.log('Resultado INSERT:', result.rows);
    const user = result.rows[0];
    const userResponse: UserResponse = {
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
    res.status(201).json({ statusCode: 201, intOpCode: 'SxUS201', data: { message: 'Usuario registrado', user: userResponse } });
  } catch (e) {
    console.error('Error en registro (catch):', e);
    res.status(500).json({ statusCode: 500, intOpCode: 'SxUS500', data: { message: 'Error en registro', error: (e && e.message) ? e.message : JSON.stringify(e) } });
  }
});

// AGREGAR USUARIO (solo admin)
router.post('/add', async (req: Request, res: Response) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ statusCode: 400, intOpCode: 'SxUS400', data: { message: 'Datos inválidos', error: parse.error.issues } });
  const { username, email, password, first_name, last_name } = parse.data;
  try {
    const existsEmail = await pool.query('SELECT COUNT(*) FROM users WHERE email = $1', [email]);
    if (parseInt(existsEmail.rows[0].count) > 0) return res.status(409).json({ statusCode: 409, intOpCode: 'SxUS409', data: { message: 'Email ya registrado' } });
    const existsUser = await pool.query('SELECT COUNT(*) FROM users WHERE username = $1', [username]);
    if (parseInt(existsUser.rows[0].count) > 0) return res.status(409).json({ statusCode: 409, intOpCode: 'SxUS409', data: { message: 'Username ya registrado' } });
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active) VALUES ($1, $2, $3, $4, $5, $6, TRUE) RETURNING id, username, email, first_name, last_name, avatar_url, phone, address, birth_date, role, created_at, updated_at',
      [username, email, password_hash, first_name, last_name, 'user']
    );
    const user = result.rows[0];
    const userResponse: UserResponse = {
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
    res.status(201).json({ statusCode: 201, intOpCode: 'SxUS201', data: { message: 'Usuario agregado', user: userResponse } });
  } catch (e) {
    res.status(500).json({ statusCode: 500, intOpCode: 'SxUS500', data: { message: 'Error al agregar usuario', error: e } });
  }
});

export default router;
