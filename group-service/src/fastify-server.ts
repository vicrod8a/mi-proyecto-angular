import Fastify from 'fastify';
import cors from '@fastify/cors';
import { supabase } from './supabase.client';

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: '*' });

// Helper: try to decode JWT payload and return the `sub` claim (user id)
function getUserIdFromAuthHeader(authHeader: string | undefined): string | null {
  try {
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length !== 2) return null;
    const token = parts[1];
    const payload = token.split('.')[1];
    if (!payload) return null;
    const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, '=');
    const json = Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    const obj = JSON.parse(json);
    return obj?.sub ?? null;
  } catch (e) {
    return null;
  }
}

// List groups
fastify.get('/groups', async (request, reply) => {
  try {
    const { data, error } = await supabase.from('groups').select('*');
    if (error) {
      fastify.log.error({ err: error }, 'Supabase select groups error');
      return reply.status(500).send({ success: false, message: error.message });
    }
    return reply.send({ success: true, data });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'List groups error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// Get single group
fastify.get('/groups/:id', async (request: any, reply) => {
  const id = request.params.id;
  try {
    const { data, error } = await supabase.from('groups').select('*').eq('id', id).maybeSingle();
    if (error) return reply.status(500).send({ success: false, message: error.message });
    if (!data) return reply.status(404).send({ success: false, message: 'Group not found' });
    return reply.send({ success: true, data });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'Get group error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// Create group
fastify.post('/groups', async (request: any, reply) => {
  const { name, description } = request.body || {};
  if (!name) return reply.status(400).send({ success: false, message: 'name is required' });

  // owner_user_id: prefer authenticated token `sub`, fall back to client-sent owner_user_id
  const authHeader = (request.headers && (request.headers.authorization || request.headers.Authorization)) as string | undefined;
  const ownerFromToken = getUserIdFromAuthHeader(authHeader);
  const ownerFromBody = (request.body && request.body.owner_user_id) ? String(request.body.owner_user_id) : null;
  const owner_user_id = ownerFromToken ?? ownerFromBody;

  if (!owner_user_id) {
    return reply.status(400).send({ success: false, message: 'owner_user_id is required (provide Authorization Bearer <jwt> or owner_user_id in body)' });
  }

  try {
    const { data, error } = await supabase
      .from('groups')
      .insert({ name, description: description || null, owner_user_id })
      .select()
      .single();
    if (error) {
      fastify.log.error({ err: error }, 'Supabase insert group error');
      // duplicate name -> 409 Conflict
      if (error?.code === '23505' || (error?.details && String(error.details).includes('duplicate key'))) {
        return reply.status(409).send({ success: false, message: 'Group with that name already exists' });
      }
      return reply.status(500).send({ success: false, message: error.message });
    }
    return reply.status(201).send({ success: true, data });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'Create group error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// Update group
fastify.put('/groups/:id', async (request: any, reply) => {
  const id = request.params.id;
  const { name, description } = request.body || {};
  try {
    const { data, error } = await supabase
      .from('groups')
      .update({ name, description })
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) {
      fastify.log.error({ err: error }, 'Supabase update group error');
      return reply.status(500).send({ success: false, message: error.message });
    }
    if (!data) return reply.status(404).send({ success: false, message: 'Group not found' });
    return reply.send({ success: true, data });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'Update group error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// Delete group
fastify.delete('/groups/:id', async (request: any, reply) => {
  const id = request.params.id;
  try {
    const { error } = await supabase.from('groups').delete().eq('id', id);
    if (error) {
      fastify.log.error({ err: error }, 'Supabase delete group error');
      return reply.status(500).send({ success: false, message: error.message });
    }
    return reply.send({ success: true, message: 'Deleted' });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'Delete group error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// Start server on different port to avoid conflict
const PORT = Number(process.env.PORT || 3002);
fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Group service listening at ${address}`);
});
