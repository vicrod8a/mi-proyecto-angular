import Fastify from 'fastify';
import cors from '@fastify/cors';
import { supabase } from './supabase.client';

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: '*' });

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
  try {
    const { data, error } = await supabase
      .from('groups')
      .insert({ name, description: description || null })
      .select()
      .single();
    if (error) {
      fastify.log.error({ err: error }, 'Supabase insert group error');
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
