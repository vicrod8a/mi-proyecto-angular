import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { supabase } from './supabase.client';
const bcrypt = require('bcryptjs');

const fastify = Fastify({ logger: true });

// Register plugins (no top-level await for compatibility with ts-node)
fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // '@fastify/cors' handles preflight automatically; keep explicit OPTIONS handler below
  preflight: true,
});
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
      .select('id, username, email, first_name, last_name, role, is_active, created_at')
      .order('created_at', { ascending: false });
    if (error) {
      fastify.log.error({ err: error }, 'Supabase select users error');
      return reply.status(500).send({ success: false, message: 'Error fetching users' });
    }

    const users = (data || []);
    const userIds = users.map((u: any) => u.id).filter(Boolean);

    // Fetch permissions for all returned users in one query
    let permsMap: Record<number, string[]> = {};
    if (userIds.length) {
      const { data: upData, error: upErr } = await supabase
        .from('user_permissions')
        .select('user_id, permissions(name)')
        .in('user_id', userIds);
      if (upErr) {
        fastify.log.error({ err: upErr }, 'Supabase select user_permissions bulk error');
        // don't fail the whole request; return users without perms
      } else {
            for (const r of (upData || [])) {
              const uid = Number(r.user_id);
              const perm: any = r.permissions;
              let name: string | null = null;
              if (perm) {
                if (Array.isArray(perm)) name = perm[0]?.name || null;
                else name = (perm as any).name || null;
              }
              if (!name) continue;
              if (!permsMap[uid]) permsMap[uid] = [];
              permsMap[uid].push(name);
            }
      }
    }

    const enriched = users.map((u: any) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      first_name: u.first_name,
      last_name: u.last_name,
      role: u.role,
      is_active: u.is_active,
      created_at: u.created_at,
      permissions: permsMap[Number(u.id)] || []
    }));

    return reply.send(enriched);
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
      const names = (reqPerms || []).map((r: any) => {
        const perm: any = r.permissions;
        if (!perm) return null;
        if (Array.isArray(perm)) return perm[0]?.name || null;
        return (perm as any).name || null;
      }).filter(Boolean as any);
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
    const names = (data || []).map((r: any) => {
      const perm: any = r.permissions;
      if (!perm) return null;
      if (Array.isArray(perm)) return perm[0]?.name || null;
      return (perm as any).name || null;
    }).filter(Boolean as any);
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
  const perms: any[] = request.body && request.body.permissions ? request.body.permissions : [];

  fastify.log.info({ requesterId, targetId, incoming: perms }, 'PUT /users/:id/permissions called');

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
      const names = (reqPerms || []).map((r: any) => {
        const perm: any = r.permissions;
        if (!perm) return null;
        if (Array.isArray(perm)) return perm[0]?.name || null;
        return (perm as any).name || null;
      }).filter(Boolean as any);
      if (!names.includes('permission.manage') && !names.includes('system.admin')) {
        return reply.status(403).send({ success: false, message: 'Forbidden' });
      }
    }

    // Normalize incoming perms: accept array of strings (names), numbers (ids) or objects { id, name }
    const incoming = Array.isArray(perms) ? perms : [];
    const nameCandidates: string[] = [];
    const idCandidates: number[] = [];
    for (const p of incoming) {
      if (p === null || p === undefined) continue;
      if (typeof p === 'string') nameCandidates.push(p);
      else if (typeof p === 'number') idCandidates.push(p);
      else if (typeof p === 'object') {
          if (p.name) nameCandidates.push(String(p.name));
          else if (p.id) {
            // if id is numeric, treat as id; if it's a string, treat as canonical name
            if (typeof p.id === 'number') idCandidates.push(Number(p.id));
            else if (typeof p.id === 'string') nameCandidates.push(String(p.id));
          }
        }
    }

    // Resolve permission rows by name and/or id
    let permsData: any[] = [];
    if (nameCandidates.length) {
      const { data: byName, error: errName } = await supabase
        .from('permissions')
        .select('id, name')
        .in('name', nameCandidates);
      if (errName) {
        fastify.log.error({ err: errName }, 'Supabase select permissions by name error');
        return reply.status(500).send({ success: false, message: 'Error resolving permissions by name' });
      }
      permsData = permsData.concat(byName || []);
    }
    if (idCandidates.length) {
      const { data: byId, error: errId } = await supabase
        .from('permissions')
        .select('id, name')
        .in('id', idCandidates);
      if (errId) {
        fastify.log.error({ err: errId }, 'Supabase select permissions by id error');
        return reply.status(500).send({ success: false, message: 'Error resolving permissions by id' });
      }
      permsData = permsData.concat(byId || []);
    }

    // If caller requested non-empty list but nothing resolved, don't delete existing permissions
    if (incoming.length > 0 && permsData.length === 0) {
      fastify.log.warn({ incoming }, 'No permissions resolved from request payload');
      return reply.status(400).send({ success: false, message: 'No matching permissions found for provided payload' });
    }

    // Deduplicate resolved permission ids
    const uniquePermsById = new Map<number, any>();
    for (const p of permsData) {
      uniquePermsById.set(Number(p.id), p);
    }

    const toInsert = Array.from(uniquePermsById.keys()).map((pid) => ({ user_id: targetId, permission_id: pid }));

    // Delete existing and insert new (if any)
    fastify.log.info({ targetId, toInsertCount: toInsert.length }, 'About to replace permissions for user');
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
      const insDataAny: any = insData;
      const insertedCount = insDataAny && Array.isArray(insDataAny) ? insDataAny.length : 0;
      fastify.log.info({ inserted: insertedCount }, 'Inserted user_permissions rows');
    }

    return reply.send({ success: true, message: 'Permissions updated' });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'PUT /users/:id/permissions error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// POST /users/:id/permissions - add a single permission to a user
fastify.post('/users/:id/permissions', async (request: any, reply: any) => {
  const requesterId = await verifyAndGetUserId(request, reply);
  if (!requesterId) return;
  const targetId = Number(request.params.id);
  // Normalize payload: Fastify may give a string for text/plain bodies
  let payload: any = request.body || {};
  if (typeof payload === 'string') {
    try {
      const parsed = JSON.parse(payload);
      // If parsed is primitive (string/number), wrap it as { permission: parsed }
      if (parsed === null || typeof parsed === 'object') payload = parsed || {};
      else payload = { permission: parsed };
    } catch (e) {
      // not JSON — treat the raw string as the permission identifier
      payload = { permission: payload };
    }
  }
  const permInput = payload.permission; // can be id (number) or name (string) or object { id, name }

  try {
    // authorization: allow self or require permission.manage/system.admin
    if (requesterId !== targetId) {
      const { data: reqPerms, error: reqErr } = await supabase
        .from('user_permissions')
        .select('permission_id, permissions(name)')
        .eq('user_id', requesterId);
      if (reqErr) {
        fastify.log.error({ err: reqErr }, 'Supabase select requester permissions error');
        return reply.status(500).send({ success: false, message: 'Error checking permissions' });
      }
      const names = (reqPerms || []).map((r: any) => {
        const perm: any = r.permissions;
        if (!perm) return null;
        if (Array.isArray(perm)) return perm[0]?.name || null;
        return (perm as any).name || null;
      }).filter(Boolean as any);
      if (!names.includes('permission.manage') && !names.includes('system.admin')) {
        return reply.status(403).send({ success: false, message: 'Forbidden' });
      }
    }

    // resolve the permission id
    let permId: number | null = null;
    if (permInput === null || permInput === undefined) return reply.status(400).send({ success: false, message: 'Missing permission' });
    if (typeof permInput === 'number') permId = Number(permInput);
    else if (typeof permInput === 'string') {
      const { data: p, error: pErr } = await supabase.from('permissions').select('id').eq('name', permInput).maybeSingle();
      if (p && p.id) permId = Number(p.id);
      if (pErr) {
        fastify.log.error({ err: pErr }, 'Supabase select permission by name error');
        return reply.status(500).send({ success: false, message: 'Error resolving permission' });
      }
    } else if (typeof permInput === 'object') {
      if (permInput.id !== null && permInput.id !== undefined) {
        if (typeof permInput.id === 'number') permId = Number(permInput.id);
        else if (typeof permInput.id === 'string') {
          // treat string id as the canonical permission name
          const { data: p, error: pErr } = await supabase.from('permissions').select('id').eq('name', permInput.id).maybeSingle();
          if (p && p.id) permId = Number(p.id);
          if (pErr) {
            fastify.log.error({ err: pErr }, 'Supabase select permission by name error');
            return reply.status(500).send({ success: false, message: 'Error resolving permission' });
          }
        }
      } else if (permInput.name) {
        const { data: p, error: pErr } = await supabase.from('permissions').select('id').eq('name', permInput.name).maybeSingle();
        if (p && p.id) permId = Number(p.id);
        if (pErr) {
          fastify.log.error({ err: pErr }, 'Supabase select permission by name error');
          return reply.status(500).send({ success: false, message: 'Error resolving permission' });
        }
      }
    }

    if (!permId) return reply.status(404).send({ success: false, message: 'Permission not found' });

    // insert ignoring duplicates (Supabase/Postgres will error on unique constraint; handle gracefully)
    const { data: ins, error: insErr } = await supabase.from('user_permissions').insert({ user_id: targetId, permission_id: permId });
    if (insErr) {
      // if conflict, return success (idempotent)
      fastify.log.warn({ err: insErr, targetId, permId }, 'Insert user_permission may have conflicted');
      // try to detect conflict: if it's a unique violation, treat as success
      return reply.send({ success: true, message: 'Permission already assigned' });
    }

    return reply.send({ success: true, message: 'Permission assigned' });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'POST /users/:id/permissions error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// DELETE /users/:id/permissions/:perm - remove a single permission by id or name
fastify.delete('/users/:id/permissions/:perm', async (request: any, reply: any) => {
  const requesterId = await verifyAndGetUserId(request, reply);
  if (!requesterId) return;
  const targetId = Number(request.params.id);
  const permParam = request.params.perm;

  try {
    // authorization: allow self or require permission.manage/system.admin
    if (requesterId !== targetId) {
      const { data: reqPerms, error: reqErr } = await supabase
        .from('user_permissions')
        .select('permission_id, permissions(name)')
        .eq('user_id', requesterId);
      if (reqErr) {
        fastify.log.error({ err: reqErr }, 'Supabase select requester permissions error');
        return reply.status(500).send({ success: false, message: 'Error checking permissions' });
      }
      const names = (reqPerms || []).map((r: any) => {
        const perm: any = r.permissions;
        if (!perm) return null;
        if (Array.isArray(perm)) return perm[0]?.name || null;
        return (perm as any).name || null;
      }).filter(Boolean as any);
      if (!names.includes('permission.manage') && !names.includes('system.admin')) {
        return reply.status(403).send({ success: false, message: 'Forbidden' });
      }
    }

    // resolve permParam to id
    let permId: number | null = null;
    if (!permParam) return reply.status(400).send({ success: false, message: 'Missing permission param' });
    if (/^\d+$/.test(String(permParam))) permId = Number(permParam);
    else {
      const { data: p, error: pErr } = await supabase.from('permissions').select('id').eq('name', String(permParam)).maybeSingle();
      if (p && p.id) permId = Number(p.id);
      if (pErr) {
        fastify.log.error({ err: pErr }, 'Supabase select permission by name error');
        return reply.status(500).send({ success: false, message: 'Error resolving permission' });
      }
    }

    if (!permId) return reply.status(404).send({ success: false, message: 'Permission not found' });

    const { data: delData, error: delErr } = await supabase.from('user_permissions').delete().match({ user_id: targetId, permission_id: permId });
    if (delErr) {
      fastify.log.error({ err: delErr }, 'Supabase delete user_permission error');
      return reply.status(500).send({ success: false, message: 'Error removing permission' });
    }

    return reply.send({ success: true, message: 'Permission removed' });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'DELETE /users/:id/permissions/:perm error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// PUT /users/:id - update user profile (self or requires permission.manage/system.admin)
fastify.put('/users/:id', async (request: any, reply: any) => {
  const requesterId = await verifyAndGetUserId(request, reply);
  if (!requesterId) return;
  const targetId = Number(request.params.id);
  const body = request.body || {};

  try {
    // if requester is not the same user, require permission.manage or system.admin
    if (requesterId !== targetId) {
      const { data: reqPerms, error: reqErr } = await supabase
        .from('user_permissions')
        .select('permission_id, permissions(name)')
        .eq('user_id', requesterId);
      if (reqErr) {
        fastify.log.error({ err: reqErr }, 'Supabase select requester permissions error');
        return reply.status(500).send({ success: false, message: 'Error checking permissions' });
      }
    const names = (reqPerms || []).map((r: any) => {
      const perm = r.permissions;
      if (!perm) return null;
      if (Array.isArray(perm)) return perm[0]?.name || null;
      return perm.name || null;
    }).filter(Boolean as any);
      if (!names.includes('permission.manage') && !names.includes('system.admin')) {
        return reply.status(403).send({ success: false, message: 'Forbidden' });
      }
    }

    const update: any = {};
    if (body.username) update.username = body.username;
    if (body.email) update.email = body.email;
    if (body.first_name) update.first_name = body.first_name;
    if (body.last_name) update.last_name = body.last_name;
    if (body.address) update.address = body.address;
    if (body.phone) update.phone = body.phone;
    if (body.birthdate) update.birthdate = body.birthdate;

    if (body.password) {
      const hashed = await bcrypt.hash(body.password, 10);
      update.password_hash = hashed;
    }

    if (Object.keys(update).length === 0) {
      return reply.status(400).send({ success: false, message: 'No data to update' });
    }

    const { data, error } = await supabase
      .from('users')
      .update(update)
      .eq('id', targetId)
      .select()
      .maybeSingle();

    if (error) {
      fastify.log.error({ err: error }, 'Supabase update user error');
      return reply.status(500).send({ success: false, message: 'Error updating user' });
    }

    return reply.send(data || null);
  } catch (e: any) {
    fastify.log.error({ err: e }, 'PUT /users/:id error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// POST /users - create a new user (requires permission.manage or system.admin)
fastify.post('/users', async (request: any, reply: any) => {
  const requesterId = await verifyAndGetUserId(request, reply);
  if (!requesterId) return;
  const body = request.body || {};

  try {
    // Check permissions for requester
    const { data: reqPerms, error: reqErr } = await supabase
      .from('user_permissions')
      .select('permission_id, permissions(name)')
      .eq('user_id', requesterId);
    if (reqErr) {
      fastify.log.error({ err: reqErr }, 'Supabase select requester permissions error');
      return reply.status(500).send({ success: false, message: 'Error checking permissions' });
    }
    const names = (reqPerms || []).map((r: any) => {
      const perm = r.permissions;
      if (!perm) return null;
      if (Array.isArray(perm)) return perm[0]?.name || null;
      return perm.name || null;
    }).filter(Boolean as any);
    if (!names.includes('permission.manage') && !names.includes('system.admin')) {
      return reply.status(403).send({ success: false, message: 'Forbidden' });
    }

    const [first_name, ...rest] = (body.first_name || body.fullName || '').split(' ');
    const last_name = rest.join(' ') || null;
    const password = body.password || Math.random().toString(36).slice(-8);
    const hash = await bcrypt.hash(password, 10);

    const insertObj: any = {
      username: body.username,
      email: body.email,
      first_name: first_name || null,
      last_name: last_name,
      address: body.address || null,
      phone: body.phone || null,
      birthdate: body.birthdate || null,
      password_hash: hash,
      role: body.role || 'user',
      is_active: typeof body.is_active === 'boolean' ? body.is_active : true
    };

    const { data, error } = await supabase.from('users').insert(insertObj).select().maybeSingle();
    if (error) {
      fastify.log.error({ err: error }, 'Supabase insert user error');
      return reply.status(500).send({ success: false, message: 'Error creating user' });
    }

    return reply.status(201).send(data || null);
  } catch (e: any) {
    fastify.log.error({ err: e }, 'POST /users error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// DELETE /users/:id - delete a user (requires permission.manage or system.admin)
fastify.delete('/users/:id', async (request: any, reply: any) => {
  const requesterId = await verifyAndGetUserId(request, reply);
  if (!requesterId) return;
  const targetId = Number(request.params.id);

  try {
    // Check permissions for requester
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

    // delete user_permissions first
    const { error: delPermErr } = await supabase.from('user_permissions').delete().eq('user_id', targetId);
    if (delPermErr) {
      fastify.log.error({ err: delPermErr }, 'Supabase delete user_permissions error');
      return reply.status(500).send({ success: false, message: 'Error deleting user permissions' });
    }

    const { data, error } = await supabase.from('users').delete().eq('id', targetId).select().maybeSingle();
    if (error) {
      fastify.log.error({ err: error }, 'Supabase delete user error');
      return reply.status(500).send({ success: false, message: 'Error deleting user' });
    }

    return reply.send({ success: true, data: data || null });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'DELETE /users/:id error');
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
