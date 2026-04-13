import Fastify from 'fastify';
import cors from '@fastify/cors';
import { createClient } from '@supabase/supabase-js';

// Supabase client (inlined for runtime resolution)
const ENV_SUPABASE_URL = process.env['SUPABASE_URL'];
const ENV_SUPABASE_KEY = process.env['SUPABASE_KEY'];
const HARDCODED_SUPABASE_URL = 'https://lmtfermgcsqwalzrqhqt.supabase.co';
const HARDCODED_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtdGZlcm1nY3Nxd2FsenJxaHF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQwNjYwOSwiZXhwIjoyMDg5OTgyNjA5fQ.J1yNZbouw6u-ef-pfFS9zcP0bSv0P08HId5svAy9BMs';
const SUPABASE_URL = ENV_SUPABASE_URL || HARDCODED_SUPABASE_URL;
const SUPABASE_KEY = ENV_SUPABASE_KEY || HARDCODED_SUPABASE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY must be set in environment for ticket-service');
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

function getJwtPayloadFromAuthHeader(authHeader: string | undefined): any | null {
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
    return obj ?? null;
  } catch (e) {
    return null;
  }
}

function getUserIdFromAuthHeader(authHeader: string | undefined): number | null {
  const payload = getJwtPayloadFromAuthHeader(authHeader);
  if (!payload) return null;
  const sub = payload.sub ?? null;
  if (!sub) return null;
  const maybe = Number(sub);
  return Number.isInteger(maybe) ? maybe : null;
}

// List tickets (optionally filter by group_id)
fastify.get('/tickets', async (request: any, reply) => {
  const authHeader = (request.headers && (request.headers.authorization || request.headers.Authorization)) as string | undefined;
  const userId = getUserIdFromAuthHeader(authHeader);
  if (userId === null) return reply.status(401).send({ success: false, message: 'Authentication required' });

  const groupId = request.query && request.query.groupId ? String(request.query.groupId) : null;
  try {
    if (groupId) {
      // Only return tickets in the group that belong to the requesting user (creator only)
      const { data, error } = await supabase.from('tickets').select('*').eq('group_id', groupId).eq('creator_user_id', userId).order('created_at', { ascending: false });
      if (error) return reply.status(500).send({ success: false, message: error.message });
      return reply.send({ success: true, data: data || [] });
    } else {
      // list tickets the user created (only their own tickets)
      const { data, error } = await supabase.from('tickets').select('*').eq('creator_user_id', userId).order('created_at', { ascending: false });
      if (error) return reply.status(500).send({ success: false, message: error.message });
      return reply.send({ success: true, data: data || [] });
    }
  } catch (e: any) {
    fastify.log.error({ err: e }, 'List tickets error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// Get ticket
fastify.get('/tickets/:id', async (request: any, reply) => {
  const id = request.params.id;
  const authHeader = (request.headers && (request.headers.authorization || request.headers.Authorization)) as string | undefined;
  const userId = getUserIdFromAuthHeader(authHeader);
  if (userId === null) return reply.status(401).send({ success: false, message: 'Authentication required' });
  try {
    const { data, error } = await supabase.from('tickets').select('*').eq('id', id).maybeSingle();
    if (error) return reply.status(500).send({ success: false, message: error.message });
    if (!data) return reply.status(404).send({ success: false, message: 'Ticket not found' });
    // check access: only the creator may view the ticket
    const isCreator = Number(data.creator_user_id) === Number(userId);
    if (!isCreator) return reply.status(403).send({ success: false, message: 'Forbidden' });

    // fetch history rows and include editor name
    try {
      const { data: historyRows, error: histErr } = await supabase.from('ticket_history').select('*').eq('ticket_id', id).order('created_at', { ascending: false });
      if (histErr) {
        return reply.send({ success: true, data, history: [] });
      }
      const enriched: any[] = [];
      for (const h of (historyRows || [])) {
        let editorName = String(h.user_id || '');
        try {
          const { data: u } = await supabase.from('users').select('first_name, username, email').eq('id', h.user_id).maybeSingle();
          if (u) editorName = u.first_name || u.username || u.email || editorName;
        } catch (e) {}
        enriched.push({ ...h, editor_name: editorName });
      }
      return reply.send({ success: true, data, history: enriched });
    } catch (e) {
      return reply.send({ success: true, data, history: [] });
    }
  } catch (e: any) {
    fastify.log.error({ err: e }, 'Get ticket error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// Create ticket
fastify.post('/tickets', async (request: any, reply) => {
  const body = request.body || {};
  const { title, description, group_id, assigned_to, priority, deadline, status } = body;
  if (!title || !group_id) return reply.status(400).send({ success: false, message: 'title and group_id are required' });
  const authHeader = (request.headers && (request.headers.authorization || request.headers.Authorization)) as string | undefined;
  const userId = getUserIdFromAuthHeader(authHeader);
  if (userId === null) return reply.status(401).send({ success: false, message: 'Authentication required' });
  try {
    // verify membership in group for creation
    const { data: gm, error: gmErr } = await supabase.from('group_members').select('role').eq('group_id', group_id).eq('user_id', userId).maybeSingle();
    if (gmErr) return reply.status(500).send({ success: false, message: gmErr.message });
    if (!gm) return reply.status(403).send({ success: false, message: 'Forbidden' });

    const insertPayload: any = {
      title: String(title).trim(),
      description: description ?? null,
      group_id: group_id,
      assignee_user_id: assigned_to ?? null,
      priority: priority ?? null,
      status: status ?? 'new',
      creator_user_id: userId,
      created_at: new Date().toISOString(),
      due_date: deadline ?? null
    };
    const { data, error } = await supabase.from('tickets').insert(insertPayload).select().maybeSingle();
    if (error) {
      fastify.log.error({ err: error }, 'Insert ticket error');
      return reply.status(500).send({ success: false, message: error.message });
    }
    return reply.status(201).send({ success: true, data });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'Create ticket error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// Update ticket
fastify.put('/tickets/:id', async (request: any, reply) => {
  const id = request.params.id;
  const body = request.body || {};
  const authHeader = (request.headers && (request.headers.authorization || request.headers.Authorization)) as string | undefined;
  const userId = getUserIdFromAuthHeader(authHeader);
  if (userId === null) return reply.status(401).send({ success: false, message: 'Authentication required' });
  try {
    const { data: existing, error: exErr } = await supabase.from('tickets').select('*').eq('id', id).maybeSingle();
    if (exErr) return reply.status(500).send({ success: false, message: exErr.message });
    if (!existing) return reply.status(404).send({ success: false, message: 'Ticket not found' });
    const isCreator = Number(existing.creator_user_id) === Number(userId);
    // Only the creator may update
    if (!isCreator) return reply.status(403).send({ success: false, message: 'Forbidden' });

    const updatePayload: any = {};
    if (typeof body.title !== 'undefined') updatePayload.title = body.title;
    if (typeof body.description !== 'undefined') updatePayload.description = body.description;
    if (typeof body.priority !== 'undefined') updatePayload.priority = body.priority;
    if (typeof body.assigned_to !== 'undefined') updatePayload.assignee_user_id = body.assigned_to;
    if (typeof body.deadline !== 'undefined') updatePayload.due_date = body.deadline;
    if (typeof body.status !== 'undefined') updatePayload.status = body.status;
    updatePayload.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from('tickets').update(updatePayload).eq('id', id).select().maybeSingle();
    if (error) return reply.status(500).send({ success: false, message: error.message });

    // compute full snapshots and insert into ticket_history
    try {
      const changes: string[] = Object.keys(updatePayload || []);

      // prepare history detail as full snapshot comparison
      const histPayload = {
        ticket_id: Number(id),
        user_id: userId,
        action: `Updated fields: ${changes.join(',')}`,
        detail: JSON.stringify({ before: existing, after: data, changedFields: changes }),
        created_at: new Date().toISOString()
      };

      const { data: histRow, error: histErr } = await supabase.from('ticket_history').insert(histPayload).select().maybeSingle();

      // enrich returned history with editor display name (do not alter DB schema)
      let editorName = String(userId);
      try {
        const { data: userRow } = await supabase.from('users').select('first_name, username, email').eq('id', userId).maybeSingle();
        if (userRow) editorName = userRow.first_name || userRow.username || userRow.email || String(userId);
      } catch (e) {
        // ignore
      }

      const returnedHistory = histRow ? [{ ...histRow, editor_name: editorName }] : [];
      return reply.send({ success: true, data, history: returnedHistory });
    } catch (e) {
      // if history insert fails, still return updated ticket
      return reply.send({ success: true, data });
    }
  } catch (e: any) {
    fastify.log.error({ err: e }, 'Update ticket error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// Delete ticket
fastify.delete('/tickets/:id', async (request: any, reply) => {
  const id = request.params.id;
  const authHeader = (request.headers && (request.headers.authorization || request.headers.Authorization)) as string | undefined;
  const userId = getUserIdFromAuthHeader(authHeader);
  if (userId === null) return reply.status(401).send({ success: false, message: 'Authentication required' });
  try {
    const { data: existing, error: exErr } = await supabase.from('tickets').select('*').eq('id', id).maybeSingle();
    if (exErr) return reply.status(500).send({ success: false, message: exErr.message });
    if (!existing) return reply.status(404).send({ success: false, message: 'Ticket not found' });
    const isCreator = Number(existing.creator_user_id) === Number(userId);
    // Only the creator may delete tickets
    if (!isCreator) return reply.status(403).send({ success: false, message: 'Forbidden' });
    const { error } = await supabase.from('tickets').delete().eq('id', id);
    if (error) return reply.status(500).send({ success: false, message: error.message });
    return reply.send({ success: true, message: 'Deleted' });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'Delete ticket error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

const PORT = Number(process.env['PORT'] || 3010);
fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Ticket service listening at ${address}`);
});
