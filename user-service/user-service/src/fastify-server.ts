import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { supabase } from './supabase.client';
const bcrypt = require('bcryptjs');

const fastify = Fastify({ logger: true });

// Register plugins (no top-level await for compatibility with ts-node)
fastify.register(cors, { origin: '*' });
fastify.register(jwt, { secret: 'supersecret' });

// Health check
fastify.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// Register endpoint (dummy, replace with real logic)
fastify.post('/register', async (request, reply) => {
  const { username, email, password, fullName, address, phone, birthDate } = request.body as any;
  if (!username || !email || !password) {
    return reply.status(400).send({ success: false, message: 'Faltan campos requeridos' });
  }

  try {
    // comprobar existencia en la tabla 'users'
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .limit(1);

    if (existing && existing.length) {
      return reply.status(409).send({ success: false, message: 'El usuario o correo ya existe' });
    }

    const hash = await bcrypt.hash(password, 10);

    const [first_name, ...rest] = (fullName || '').split(' ');
    const last_name = rest.join(' ') || null;

    // Insert into full schema (including optional address/phone/birthdate and password_hash)
    const { data, error } = await supabase
      .from('users')
      .insert({
        username,
        email,
        first_name: first_name || null,
        last_name: last_name,
        address: address || null,
        phone: phone || null,
        birthdate: birthDate || null,
        password_hash: hash,
        role: 'user',
        is_active: true
      })
      .select()
      .single();

    if (error) {
      // Log full error for debugging
      fastify.log.error({ err: error }, 'Supabase insert error');
      // Return detailed error to client for faster debugging (remove in production)
      return reply.status(500).send({
        success: false,
        message: error.message || 'Error al crear usuario',
        details: error.details || null,
        hint: (error as any).hint || null,
        code: (error as any).code || null
      });
    }

    return reply.status(201).send({ success: true, message: 'Usuario creado correctamente', id: data.id });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'Register handler error');
    return reply.status(500).send({ success: false, message: 'Error interno' });
  }
});

// Login endpoint (dummy, replace with real logic)
fastify.post('/login', async (request, reply) => {
  const { email, password } = request.body as any;
  if (!email || !password) {
    return reply.status(400).send({ success: false, message: 'Faltan campos requeridos' });
  }

  try {
    // Try to retrieve user by email first (safer when email contains special chars)
    const { data: userByEmail, error: errEmail } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (errEmail) {
      fastify.log.error({ err: errEmail }, 'Supabase select by email error');
      return reply.status(500).send({ success: false, message: 'Error en autenticación' });
    }

    let user = userByEmail;

    // If not found by email, try username
    if (!user) {
      const { data: userByUsername, error: errUser } = await supabase
        .from('users')
        .select('*')
        .eq('username', email)
        .maybeSingle();

      if (errUser) {
        fastify.log.error({ err: errUser }, 'Supabase select by username error');
        return reply.status(500).send({ success: false, message: 'Error en autenticación' });
      }
      user = userByUsername;
    }

    if (!user) return reply.status(401).send({ success: false, message: 'Credenciales incorrectas' });

    // Log presence of password fields for debugging (do not log actual hashes)
    fastify.log.info({ hasPasswordHash: !!user.password_hash, hasPasswordField: !!user.password }, 'Login user fields');

    // Prefer `password_hash` (bcrypt) if present, fall back to `password` or other fields
    const valid = await bcrypt.compare(password, user.password_hash || user.password || user.encrypted_password || '');
    if (!valid) return reply.status(401).send({ success: false, message: 'Credenciales incorrectas' });

    const token = (fastify as any).jwt.sign({ sub: user.id, email: user.email, role: user.rol });
    return reply.send({ success: true, token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'Login handler error');
    return reply.status(500).send({ success: false, message: 'Error interno' });
  }
});

// Start server
fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
