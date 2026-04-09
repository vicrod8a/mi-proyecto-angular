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

// Helper: verify JWT and return numeric user id (or reply 401)
async function verifyAndGetUserId(request: any, reply: any): Promise<number | null> {
  try {
    await request.jwtVerify();
    const payload = (request as any).user || (request as any).jwt || (request as any).payload;
    const sub = payload?.sub ?? payload?.id ?? payload?.userId;
    return sub ? Number(sub) : null;
  } catch (e: any) {
    return reply.status(401).send({ success: false, message: 'Unauthorized' });
  }
}

// GET /users - list users (basic fields)
fastify.get('/users', async (request, reply) => {
  const requesterId = await verifyAndGetUserId(request, reply);
  if (!requesterId) return;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, first_name, last_name, role, is_active')
      .order('created_at', { ascending: false });
    if (error) {
      fastify.log.error({ err: error }, 'Supabase select users error');
      return reply.status(500).send({ success: false, message: 'Error fetching users' });
    }
    return reply.send(data || []);
  } catch (e: any) {
    fastify.log.error({ err: e }, 'GET /users error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// GET /users/:id - get user by id
fastify.get('/users/:id', async (request: any, reply: any) => {
  const requesterId = await verifyAndGetUserId(request, reply);
  if (!requesterId) return;
  const id = Number(request.params.id);
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, first_name, last_name, role, is_active')
      .eq('id', id)
      .maybeSingle();
    if (error) {
      fastify.log.error({ err: error }, 'Supabase select user by id error');
      return reply.status(500).send({ success: false, message: 'Error fetching user' });
    }
    if (!data) return reply.status(404).send({ success: false, message: 'User not found' });
    return reply.send(data);
  } catch (e: any) {
    fastify.log.error({ err: e }, 'GET /users/:id error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// GET /users/me - return authenticated user
fastify.get('/users/me', async (request: any, reply: any) => {
  const requesterId = await verifyAndGetUserId(request, reply);
  if (!requesterId) return;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, first_name, last_name, role, is_active')
      .eq('id', requesterId)
      .maybeSingle();
    if (error) {
      fastify.log.error({ err: error }, 'Supabase select me error');
      return reply.status(500).send({ success: false, message: 'Error fetching user' });
    }
    return reply.send(data || null);
  } catch (e: any) {
    fastify.log.error({ err: e }, 'GET /users/me error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// GET /users/permissions - return array of permission names for the authenticated user
fastify.get('/users/permissions', async (request: any, reply: any) => {
  const requesterId = await verifyAndGetUserId(request, reply);
  if (!requesterId) return;
  try {
    // join user_permissions -> permissions
    const { data, error } = await supabase
      .from('user_permissions')
      .select('permission_id, permissions(name)')
      .eq('user_id', requesterId);
    if (error) {
      fastify.log.error({ err: error }, 'Supabase select user_permissions error');
      return reply.status(500).send({ success: false, message: 'Error fetching permissions' });
    }
    const names = (data || []).map((r: any) => {
      return (r.permissions && r.permissions.name) || null;
    }).filter(Boolean);
    return reply.send(names);
  } catch (e: any) {
    fastify.log.error({ err: e }, 'GET /users/permissions error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// GET /users/:id/permissions - return permissions for a specific user
fastify.get('/users/:id/permissions', async (request: any, reply: any) => {
  const requesterId = await verifyAndGetUserId(request, reply);
  if (!requesterId) return;
  const targetId = Number(request.params.id);
  try {
    // If requester is not the same user, require permission.manage or system.admin
    if (requesterId !== targetId) {
      const { data: reqPerms, error: reqErr } = await supabase
        .from('user_permissions')
        .select('permission_id, permissions(name)')
        .eq('user_id', requesterId);
      if (reqErr) {
        fastify.log.error({ err: reqErr }, 'Supabase select requester permissions error');
        return reply.status(500).send({ success: false, message: 'Error checking permissions' });
      }
      const names = (reqPerms || []).map((r: any) => (r.permissions && r.permissions.name) || null).filter(Boolean);
      if (!names.includes('permission.manage') && !names.includes('system.admin')) {
        return reply.status(403).send({ success: false, message: 'Forbidden' });
      }
    }

    const { data, error } = await supabase
      .from('user_permissions')
      .select('permission_id, permissions(name)')
      .eq('user_id', targetId);

    if (error) {
      fastify.log.error({ err: error }, 'Supabase select user_permissions by id error');
      return reply.status(500).send({ success: false, message: 'Error fetching permissions' });
    }
    const names = (data || []).map((r: any) => (r.permissions && r.permissions.name) || null).filter(Boolean);
    return reply.send(names);
  } catch (e: any) {
    fastify.log.error({ err: e }, 'GET /users/:id/permissions error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// PUT /users/:id/permissions - replace permissions for a user (requires permission.manage)
fastify.put('/users/:id/permissions', async (request: any, reply: any) => {
  const requesterId = await verifyAndGetUserId(request, reply);
  if (!requesterId) return;
  const targetId = Number(request.params.id);
  const perms: string[] = request.body && request.body.permissions ? request.body.permissions : [];

  try {
    // if requester is not the same user, require permission.manage
    if (requesterId !== targetId) {
      const { data: reqPerms, error: reqErr } = await supabase
        .from('user_permissions')
        .select('permission_id, permissions(name)')
        .eq('user_id', requesterId);
      if (reqErr) {
        fastify.log.error({ err: reqErr }, 'Supabase select requester permissions error');
        return reply.status(500).send({ success: false, message: 'Error checking permissions' });
      }
      const names = (reqPerms || []).map((r: any) => (r.permissions && r.permissions.name) || null).filter(Boolean);
      if (!names.includes('permission.manage') && !names.includes('system.admin')) {
        return reply.status(403).send({ success: false, message: 'Forbidden' });
      }
    }

    // Map permission names to ids
    const { data: permsData, error: permsErr } = await supabase
      .from('permissions')
      .select('id, name')
      .in('name', perms);
    if (permsErr) {
      fastify.log.error({ err: permsErr }, 'Supabase select permissions error');
      return reply.status(500).send({ success: false, message: 'Error resolving permissions' });
    }

    const toInsert = (permsData || []).map((p: any) => ({ user_id: targetId, permission_id: p.id }));

    // Delete existing and insert new
    const { data: delData, error: delErr } = await supabase.from('user_permissions').delete().eq('user_id', targetId);
    if (delErr) {
      fastify.log.error({ err: delErr }, 'Supabase delete user_permissions error');
      return reply.status(500).send({ success: false, message: 'Error updating permissions' });
    }

    if (toInsert.length) {
      const { data: insData, error: insErr } = await supabase.from('user_permissions').insert(toInsert);
      if (insErr) {
        fastify.log.error({ err: insErr }, 'Supabase insert user_permissions error');
        return reply.status(500).send({ success: false, message: 'Error inserting permissions' });
      }
    }

    return reply.send({ success: true, message: 'Permissions updated' });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'PUT /users/:id/permissions error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
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
