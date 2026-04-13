import Fastify from 'fastify';
import cors from '@fastify/cors';
import { supabase } from './supabase.client';

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

// Helper: try to decode JWT payload and return the parsed payload object
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

// Helper: resolve integer user id from Authorization header (JWT `sub`) or null
function getUserIdFromAuthHeader(authHeader: string | undefined): number | null {
  const payload = getJwtPayloadFromAuthHeader(authHeader);
  if (!payload) return null;
  const sub = payload.sub ?? null;
  if (!sub) return null;
  const maybe = Number(sub);
  return Number.isInteger(maybe) ? maybe : null;
}

// List groups
fastify.get('/groups', async (request, reply) => {
  // only return groups the authenticated user owns or belongs to
  try {
    const authHeader = (request.headers && (request.headers.authorization || request.headers.Authorization)) as string | undefined;
    const userId = getUserIdFromAuthHeader(authHeader);
    if (userId === null) return reply.status(401).send({ success: false, message: 'Authentication required' });

    // groups where user is a member
    const { data: memberRows, error: mrErr } = await supabase.from('group_members').select('group_id').eq('user_id', userId);
    if (mrErr) {
      fastify.log.error({ err: mrErr }, 'Supabase select group_members error');
      return reply.status(500).send({ success: false, message: mrErr.message });
    }
    const memberIds = Array.isArray(memberRows) ? memberRows.map((r: any) => r.group_id) : [];

    // fetch groups where owner or in memberIds
    let groups: any[] = [];
    if (memberIds.length > 0) {
      const idsStr = memberIds.join(',');
      const { data, error } = await supabase.from('groups').select('*, group_members(user_id,role)').or(`owner_user_id.eq.${userId},id.in.(${idsStr})`);
      if (error) {
        fastify.log.error({ err: error }, 'Supabase select groups error');
        return reply.status(500).send({ success: false, message: error.message });
      }
      groups = data || [];
    } else {
      const { data, error } = await supabase.from('groups').select('*, group_members(user_id,role)').eq('owner_user_id', userId);
      if (error) {
        fastify.log.error({ err: error }, 'Supabase select groups error');
        return reply.status(500).send({ success: false, message: error.message });
      }
      groups = data || [];
    }

    const mapped = (groups || []).map((g: any) => ({
      ...g,
      member_count: Array.isArray(g.group_members) ? g.group_members.filter((m: any) => m.role !== 'invited').length : 0,
      members_list: Array.isArray(g.group_members) ? g.group_members.filter((m: any) => m.role !== 'invited').map((m: any) => m.user_id) : [],
      membership_status: (() => {
        if (!Array.isArray(g.group_members)) return 'none';
        const self = g.group_members.find((m: any) => Number(m.user_id) === Number(userId));
        return self ? (self.role === 'invited' ? 'invited' : (self.role === 'owner' ? 'owner' : 'member')) : 'none';
      })()
    }));
    return reply.send({ success: true, data: mapped });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'List groups error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// Get single group
fastify.get('/groups/:id', async (request: any, reply) => {
  const id = request.params.id;
  try {
    const authHeader = (request.headers && (request.headers.authorization || request.headers.Authorization)) as string | undefined;
    const userId = getUserIdFromAuthHeader(authHeader);
    if (userId === null) return reply.status(401).send({ success: false, message: 'Authentication required' });

    const { data, error } = await supabase.from('groups').select('*, group_members(user_id)').eq('id', id).maybeSingle();
    if (error) return reply.status(500).send({ success: false, message: error.message });
    if (!data) return reply.status(404).send({ success: false, message: 'Group not found' });

    const isOwner = Number(data.owner_user_id) === Number(userId);
    const isMember = Array.isArray(data.group_members) && data.group_members.some((m: any) => Number(m.user_id) === Number(userId));
    if (!isOwner && !isMember) return reply.status(403).send({ success: false, message: 'Forbidden' });

    const mapped = {
      ...data,
      member_count: Array.isArray(data.group_members) ? data.group_members.length : 0,
      members_list: Array.isArray(data.group_members) ? data.group_members.map((m: any) => m.user_id) : []
    };
    return reply.send({ success: true, data: mapped });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'Get group error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// Create group
fastify.post('/groups', async (request: any, reply) => {
  const { name, description, level } = request.body || {};
  if (!name) return reply.status(400).send({ success: false, message: 'name is required' });

  // owner_user_id: prefer authenticated token `sub`, fall back to client-sent owner_user_id
  const authHeader = (request.headers && (request.headers.authorization || request.headers.Authorization)) as string | undefined;
  const ownerPayload = getJwtPayloadFromAuthHeader(authHeader);
  const ownerFromToken = ownerPayload?.sub ?? null;
  const ownerFromBody = (request.body && request.body.owner_user_id) ? String(request.body.owner_user_id) : null;

  // Resolve numeric owner id. Try token.sub if it's integer, else try to resolve by token.email, then body.
  let ownerIdNum: number | null = null;
  if (ownerFromToken) {
    const maybe = Number(ownerFromToken);
    if (Number.isInteger(maybe)) ownerIdNum = maybe;
  }
  // If token didn't give integer id, try to resolve by email claim
  if (ownerIdNum === null && ownerPayload?.email) {
    try {
      const { data: userRow, error: userErr } = await supabase.from('users').select('id').eq('email', ownerPayload.email).maybeSingle();
      if (!userErr && userRow && userRow.id) {
        ownerIdNum = userRow.id;
      }
    } catch (e) {
      fastify.log.error({ err: e }, 'Failed to resolve owner user id by email from token');
    }
  }
  // Last resort: use owner_user_id from body
  if (ownerIdNum === null && ownerFromBody) {
    const maybe = Number(ownerFromBody);
    if (Number.isInteger(maybe)) ownerIdNum = maybe;
  }

  if (ownerIdNum === null) {
    return reply.status(400).send({ success: false, message: 'owner_user_id is required (provide Authorization Bearer <jwt> with integer sub or an email claim, or owner_user_id in body)' });
  }

  try {
    // generate simple invite code (8 chars) for joining by code
    function genCode(len = 8) {
      const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
      let out = '';
      for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
      return out;
    }

    const insertPayloadBase: any = { name: name.trim(), description: description || null, owner_user_id: ownerIdNum };
    if (level) insertPayloadBase.level = level;

    // Try inserting with invitation_code when possible; if DB schema doesn't have that column, retry without it.
    let data: any = null;
    let insertError: any = null;
    const tryInsert = async (payload: any) => await supabase.from('groups').insert(payload).select().single();

    try {
      const payloadWithCode = { ...insertPayloadBase, invitation_code: genCode() };
      const res = await tryInsert(payloadWithCode);
      data = res.data;
      insertError = res.error;
      if (insertError && String(insertError.message || '').toLowerCase().includes('invitation_code')) {
        // Column likely missing in DB; retry without invitation_code
        fastify.log.warn({ err: insertError }, 'invitation_code column missing, retrying insert without it');
        const res2 = await tryInsert(insertPayloadBase);
        data = res2.data;
        insertError = res2.error;
      }
    } catch (e: any) {
      fastify.log.error({ err: e }, 'Unexpected exception during supabase insert');
      return reply.status(500).send({ success: false, message: 'Internal error' });
    }

    if (insertError) {
      fastify.log.error({ err: insertError }, 'Supabase insert group error');
      if (insertError?.code === '23505' || (insertError?.details && String(insertError.details).includes('duplicate key'))) {
        return reply.status(409).send({ success: false, message: 'Group with that name already exists' });
      }
      return reply.status(500).send({ success: false, message: insertError.message });
    }
    // Insert owner as initial member in group_members
    try {
      const { error: gmErr } = await supabase.from('group_members').insert({ group_id: data.id, user_id: ownerIdNum, role: 'owner' }).select();
      if (gmErr) {
        fastify.log.error({ err: gmErr }, 'Failed to insert owner into group_members');
      }
    } catch (e: any) {
      fastify.log.error({ err: e }, 'Unexpected error inserting group_members');
    }

    // fetch group with members to return a unified payload
    try {
      const { data: groupWithMembers, error: qErr } = await supabase.from('groups').select('*, group_members(user_id)').eq('id', data.id).maybeSingle();
      if (qErr) {
        fastify.log.error({ err: qErr }, 'Failed to fetch created group with members');
        return reply.status(201).send({ success: true, data });
      }
      const mapped = {
        ...groupWithMembers,
        member_count: Array.isArray(groupWithMembers?.group_members) ? groupWithMembers.group_members.length : 0,
        members_list: Array.isArray(groupWithMembers?.group_members) ? groupWithMembers.group_members.map((m: any) => m.user_id) : []
      };
      return reply.status(201).send({ success: true, data: mapped });
    } catch (e: any) {
      fastify.log.error({ err: e }, 'Error fetching created group with members');
      return reply.status(201).send({ success: true, data });
    }
  } catch (e: any) {
    fastify.log.error({ err: e }, 'Create group error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// Update group
fastify.put('/groups/:id', async (request: any, reply) => {
  const id = request.params.id;
  const { name, description, level } = request.body || {};
  try {
    const updatePayload: any = { name, description };
    if (typeof level !== 'undefined') updatePayload.level = level;
    const { data: updated, error } = await supabase
      .from('groups')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) {
      fastify.log.error({ err: error }, 'Supabase update group error');
      return reply.status(500).send({ success: false, message: error.message });
    }
    if (!updated) return reply.status(404).send({ success: false, message: 'Group not found' });
    // fetch members
    try {
      const { data: groupWithMembers, error: qErr } = await supabase.from('groups').select('*, group_members(user_id)').eq('id', id).maybeSingle();
      if (qErr) {
        fastify.log.error({ err: qErr }, 'Failed to fetch updated group with members');
        return reply.send({ success: true, data: updated });
      }
      const mapped = {
        ...groupWithMembers,
        member_count: Array.isArray(groupWithMembers?.group_members) ? groupWithMembers.group_members.length : 0,
        members_list: Array.isArray(groupWithMembers?.group_members) ? groupWithMembers.group_members.map((m: any) => m.user_id) : []
      };
      return reply.send({ success: true, data: mapped });
    } catch (e: any) {
      fastify.log.error({ err: e }, 'Error fetching updated group with members');
      return reply.send({ success: true, data: updated });
    }
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

// Add member to group
fastify.post('/groups/:id/members', async (request: any, reply) => {
  const id = request.params.id;
  const { user_id } = request.body || {};
  // derive user from token if not provided
  const authHeader = (request.headers && (request.headers.authorization || request.headers.Authorization)) as string | undefined;
  const ownerPayload = getJwtPayloadFromAuthHeader(authHeader);
  const tokenUser = ownerPayload?.sub ?? null;
  let userIdNum: number | null = null;
  if (user_id) {
    const maybe = Number(user_id);
    if (Number.isInteger(maybe)) userIdNum = maybe;
  }
  if (userIdNum === null && tokenUser) {
    const maybe = Number(tokenUser);
    if (Number.isInteger(maybe)) userIdNum = maybe;
  }
  if (userIdNum === null) return reply.status(400).send({ success: false, message: 'user_id required' });
  try {
    const { error: insErr } = await supabase.from('group_members').insert({ group_id: id, user_id: userIdNum, role: 'invited', joined_at: null });
    if (insErr) {
      fastify.log.error({ err: insErr }, 'Failed to insert group member');
      return reply.status(500).send({ success: false, message: insErr.message });
    }
    const { data: groupWithMembers, error: qErr } = await supabase.from('groups').select('*, group_members(user_id,role)').eq('id', id).maybeSingle();
    if (qErr) return reply.status(200).send({ success: true, data: groupWithMembers });
    const mapped = {
      ...groupWithMembers,
      member_count: Array.isArray(groupWithMembers?.group_members) ? groupWithMembers.group_members.filter((m: any) => m.role !== 'invited').length : 0,
      members_list: Array.isArray(groupWithMembers?.group_members) ? groupWithMembers.group_members.filter((m: any) => m.role !== 'invited').map((m: any) => m.user_id) : [],
        membership_status: (() => {
          if (!Array.isArray(groupWithMembers?.group_members)) return 'none';
          const actorId = tokenUser ? Number(tokenUser) : null;
          const self = groupWithMembers.group_members.find((m: any) => actorId !== null && Number(m.user_id) === actorId);
          return self ? (self.role === 'invited' ? 'invited' : (self.role === 'owner' ? 'owner' : 'member')) : 'none';
        })()
    };
    return reply.send({ success: true, data: mapped });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'Add member error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// Join group by invite code
fastify.post('/groups/join-by-code', async (request: any, reply) => {
  const { code } = request.body || {};
  if (!code) return reply.status(400).send({ success: false, message: 'code required' });
  const authHeader = (request.headers && (request.headers.authorization || request.headers.Authorization)) as string | undefined;
  const userId = getUserIdFromAuthHeader(authHeader);
  if (userId === null) return reply.status(401).send({ success: false, message: 'Authentication required' });
  try {
    const { data: group, error } = await supabase.from('groups').select('id').eq('invitation_code', String(code)).maybeSingle();
    if (error) return reply.status(500).send({ success: false, message: error.message });
    if (!group) return reply.status(404).send({ success: false, message: 'Invalid invite code' });
    // insert membership
    try {
      // if an invited row exists, promote to member; else insert as member
      const { data: exists, error: exErr } = await supabase.from('group_members').select('id,role').eq('group_id', group.id).eq('user_id', userId).maybeSingle();
      if (!exErr && exists) {
        // update role to member
        await supabase.from('group_members').update({ role: 'member', joined_at: new Date().toISOString() }).eq('id', exists.id);
      } else {
        const { error: insErr } = await supabase.from('group_members').insert({ group_id: group.id, user_id: userId, role: 'member' });
        if (insErr) {
          fastify.log.error({ err: insErr }, 'Failed to insert group member by code');
          // if duplicate, ignore and return success
          if (!(insErr?.details && String(insErr.details).includes('duplicate'))) {
            return reply.status(500).send({ success: false, message: insErr.message });
          }
        }
      }
    } catch (e: any) {
      fastify.log.error({ err: e }, 'Unexpected error inserting group_members by code');
    }
    const { data: groupWithMembers, error: qErr } = await supabase.from('groups').select('*, group_members(user_id, role)').eq('id', group.id).maybeSingle();
    if (qErr) return reply.status(200).send({ success: true, data: groupWithMembers });
    const mapped = {
      ...groupWithMembers,
      member_count: Array.isArray(groupWithMembers?.group_members) ? groupWithMembers.group_members.filter((m: any) => m.role !== 'invited').length : 0,
      members_list: Array.isArray(groupWithMembers?.group_members) ? groupWithMembers.group_members.filter((m: any) => m.role !== 'invited').map((m: any) => m.user_id) : [],
      membership_status: (() => {
        if (!Array.isArray(groupWithMembers?.group_members)) return 'none';
        const self = groupWithMembers.group_members.find((m: any) => Number(m.user_id) === Number(userId));
        return self ? (self.role === 'invited' ? 'invited' : (self.role === 'owner' ? 'owner' : 'member')) : 'none';
      })()
    };
    return reply.send({ success: true, data: mapped });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'Join by code error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// Accept an invitation to a group (user clicks 'Unirse' from UI)
fastify.post('/groups/:id/members/accept', async (request: any, reply) => {
  const id = request.params.id;
  const authHeader = (request.headers && (request.headers.authorization || request.headers.Authorization)) as string | undefined;
  const userId = getUserIdFromAuthHeader(authHeader);
  if (userId === null) return reply.status(401).send({ success: false, message: 'Authentication required' });
  try {
    const { data: invite, error: invErr } = await supabase.from('group_members').select('id,role').eq('group_id', id).eq('user_id', userId).maybeSingle();
    if (invErr) {
      fastify.log.error({ err: invErr }, 'Failed to query group_members for accept');
      return reply.status(500).send({ success: false, message: invErr.message });
    }
    if (!invite) return reply.status(404).send({ success: false, message: 'Invitation not found' });
    if (invite.role !== 'invited') return reply.status(400).send({ success: false, message: 'No pending invitation to accept' });

    const { error: updErr } = await supabase.from('group_members').update({ role: 'member', joined_at: new Date().toISOString(), invited_at: null }).eq('id', invite.id);
    if (updErr) {
      fastify.log.error({ err: updErr }, 'Failed to promote invited to member');
      return reply.status(500).send({ success: false, message: updErr.message });
    }

    const { data: groupWithMembers, error: qErr } = await supabase.from('groups').select('*, group_members(user_id,role)').eq('id', id).maybeSingle();
    if (qErr) return reply.status(200).send({ success: true, data: groupWithMembers });
    const mapped = {
      ...groupWithMembers,
      member_count: Array.isArray(groupWithMembers?.group_members) ? groupWithMembers.group_members.filter((m: any) => m.role !== 'invited').length : 0,
      members_list: Array.isArray(groupWithMembers?.group_members) ? groupWithMembers.group_members.filter((m: any) => m.role !== 'invited').map((m: any) => m.user_id) : [],
      membership_status: (() => {
        if (!Array.isArray(groupWithMembers?.group_members)) return 'none';
        const self = groupWithMembers.group_members.find((m: any) => Number(m.user_id) === Number(userId));
        return self ? (self.role === 'invited' ? 'invited' : (self.role === 'owner' ? 'owner' : 'member')) : 'none';
      })()
    };
    return reply.send({ success: true, data: mapped });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'Accept invitation error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// Search users (for management panel)
fastify.get('/users', async (request: any, reply) => {
  const q = (request.query && request.query.q) ? String(request.query.q) : '';
  const authHeader = (request.headers && (request.headers.authorization || request.headers.Authorization)) as string | undefined;
  const userId = getUserIdFromAuthHeader(authHeader);
  if (userId === null) return reply.status(401).send({ success: false, message: 'Authentication required' });
  try {
    if (!q) return reply.send({ success: true, data: [] });
    // try search by full_name or email
    const pattern = `%${q}%`;
    const { data, error } = await supabase.from('users').select('id,email,full_name').or(`full_name.ilike.${pattern},email.ilike.${pattern}`);
    if (error) {
      fastify.log.error({ err: error }, 'Supabase users search error');
      return reply.status(500).send({ success: false, message: error.message });
    }
    return reply.send({ success: true, data: data || [] });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'Users search error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// Bulk add members (owner only)
fastify.post('/groups/:id/members/bulk', async (request: any, reply) => {
  const id = request.params.id;
  const { user_ids } = request.body || {};
  if (!Array.isArray(user_ids) || user_ids.length === 0) return reply.status(400).send({ success: false, message: 'user_ids required' });
  const authHeader = (request.headers && (request.headers.authorization || request.headers.Authorization)) as string | undefined;
  const userId = getUserIdFromAuthHeader(authHeader);
  if (userId === null) return reply.status(401).send({ success: false, message: 'Authentication required' });
  try {
    const { data: group, error: gErr } = await supabase.from('groups').select('owner_user_id').eq('id', id).maybeSingle();
    if (gErr) return reply.status(500).send({ success: false, message: gErr.message });
    if (!group) return reply.status(404).send({ success: false, message: 'Group not found' });
    if (Number(group.owner_user_id) !== Number(userId)) return reply.status(403).send({ success: false, message: 'Only owner can add members' });

    // insert each member, ignore duplicates
    for (const uidRaw of user_ids) {
      const uid = Number(uidRaw);
      if (!Number.isInteger(uid)) continue;
      try {
        const { error: insErr } = await supabase.from('group_members').insert({ group_id: id, user_id: uid, role: 'invited', joined_at: null });
        if (insErr) {
          // ignore duplicate errors
          if (!(insErr?.details && String(insErr.details).includes('duplicate'))) {
            fastify.log.error({ err: insErr }, 'Failed to insert group member in bulk');
          }
        }
      } catch (e: any) {
        fastify.log.error({ err: e }, 'Unexpected error inserting group_members in bulk');
      }
    }

    const { data: groupWithMembers, error: qErr } = await supabase.from('groups').select('*, group_members(user_id)').eq('id', id).maybeSingle();
    if (qErr) return reply.status(200).send({ success: true, data: groupWithMembers });
    const mapped = {
      ...groupWithMembers,
      member_count: Array.isArray(groupWithMembers?.group_members) ? groupWithMembers.group_members.length : 0,
      members_list: Array.isArray(groupWithMembers?.group_members) ? groupWithMembers.group_members.map((m: any) => m.user_id) : []
    };
    return reply.send({ success: true, data: mapped });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'Bulk add members error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// Remove member from group
fastify.delete('/groups/:id/members/:userId', async (request: any, reply) => {
  const id = request.params.id;
  const userId = request.params.userId;
  try {
    const { error } = await supabase.from('group_members').delete().eq('group_id', id).eq('user_id', userId);
    if (error) {
      fastify.log.error({ err: error }, 'Failed to delete group_member');
      return reply.status(500).send({ success: false, message: error.message });
    }
    const { data: groupWithMembers, error: qErr } = await supabase.from('groups').select('*, group_members(user_id)').eq('id', id).maybeSingle();
    if (qErr) return reply.status(200).send({ success: true, data: groupWithMembers });
    const mapped = {
      ...groupWithMembers,
      member_count: Array.isArray(groupWithMembers?.group_members) ? groupWithMembers.group_members.length : 0,
      members_list: Array.isArray(groupWithMembers?.group_members) ? groupWithMembers.group_members.map((m: any) => m.user_id) : []
    };
    return reply.send({ success: true, data: mapped });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'Remove member error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// Transfer owner of group
fastify.put('/groups/:id/transfer-owner', async (request: any, reply) => {
  const id = request.params.id;
  const { new_owner_id } = request.body || {};
  if (!new_owner_id) return reply.status(400).send({ success: false, message: 'new_owner_id required' });
  const maybe = Number(new_owner_id);
  if (!Number.isInteger(maybe)) return reply.status(400).send({ success: false, message: 'new_owner_id must be integer' });
  try {
    // update owner_user_id
    const { data: updated, error: updErr } = await supabase.from('groups').update({ owner_user_id: maybe }).eq('id', id).select().maybeSingle();
    if (updErr) {
      fastify.log.error({ err: updErr }, 'Failed to update owner');
      return reply.status(500).send({ success: false, message: updErr.message });
    }
    // ensure new owner is member
    try {
      const { data: exists, error: existsErr } = await supabase.from('group_members').select('id,user_id').eq('group_id', id).eq('user_id', maybe).maybeSingle();
      if (!exists && !existsErr) {
        await supabase.from('group_members').insert({ group_id: id, user_id: maybe, role: 'owner' });
      } else if (exists) {
        await supabase.from('group_members').update({ role: 'owner' }).eq('id', exists.id);
      }
    } catch (e) {
      // ignore
    }
    // fetch group with members
    const { data: groupWithMembers, error: qErr } = await supabase.from('groups').select('*, group_members(user_id)').eq('id', id).maybeSingle();
    if (qErr) return reply.send({ success: true, data: updated });
    const mapped = {
      ...groupWithMembers,
      member_count: Array.isArray(groupWithMembers?.group_members) ? groupWithMembers.group_members.length : 0,
      members_list: Array.isArray(groupWithMembers?.group_members) ? groupWithMembers.group_members.map((m: any) => m.user_id) : []
    };
    return reply.send({ success: true, data: mapped });
  } catch (e: any) {
    fastify.log.error({ err: e }, 'Transfer owner error');
    return reply.status(500).send({ success: false, message: 'Internal error' });
  }
});

// Start server on different port to avoid conflict
// Default changed to 3003 per request
const PORT = Number(process.env.PORT || 3003);
fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Group service listening at ${address}`);
});
