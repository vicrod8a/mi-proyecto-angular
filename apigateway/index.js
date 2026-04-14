const Fastify = require('fastify');
const http = require('http');
const https = require('https');
const { pipeline } = require('stream');
const { URL } = require('url');
const cors = require('@fastify/cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const fastify = Fastify({ logger: true });

// helper to perform simple JSON HTTP request to upstream services
const doRequest = (url, method = 'GET', headers = {}, body = undefined) => new Promise((resolve, reject) => {
  try {
    const u = new URL(url);
    const client = u.protocol === 'https:' ? https : http;
    const opts = { hostname: u.hostname, port: u.port || (u.protocol === 'https:' ? 443 : 80), path: u.pathname + (u.search || ''), method, headers };
    const req = client.request(opts, (res) => {
      let buf = '';
      res.on('data', (c) => buf += c.toString());
      res.on('end', () => {
        try { const parsed = JSON.parse(buf || '{}'); resolve({ statusCode: res.statusCode || 200, body: parsed }); }
        catch (e) { resolve({ statusCode: res.statusCode || 200, body: buf }); }
      });
    });
    req.on('error', (err) => reject(err));
    if (body !== undefined && body !== null) {
      const s = typeof body === 'string' ? body : JSON.stringify(body);
      req.setHeader('Content-Type', 'application/json');
      req.setHeader('Content-Length', Buffer.byteLength(s));
      req.write(s);
    }
    req.end();
  } catch (e) { reject(e); }
});

// Remove incoming Content-Length/Transfer-Encoding headers early
// so Fastify's content parser won't reject requests with mismatched lengths
fastify.addHook('onRequest', async (request, reply) => {
  try {
    if (request && request.headers) {
      for (const h of Object.keys(request.headers)) {
        if (h && typeof h === 'string' && (h.toLowerCase() === 'transfer-encoding' || h.toLowerCase() === 'content-length')) {
          delete request.headers[h];
        }
      }
    }
    if (request && request.raw && request.raw.headers) {
      for (const h of Object.keys(request.raw.headers)) {
        if (h && typeof h === 'string' && (h.toLowerCase() === 'transfer-encoding' || h.toLowerCase() === 'content-length')) {
          delete request.raw.headers[h];
        }
      }
    }
  } catch (e) {
    request.log && request.log.warn({ err: e }, 'failed to strip incoming headers');
  }
});

fastify.register(cors, {
  origin: '*',
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
});

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Simple auth preHandler that verifies JWT and attaches payload
fastify.addHook('preHandler', async (request, reply) => {
  const raw = request.raw.url || request.url || '/';
  const method = (request.raw.method || '').toUpperCase();
  // allow preflight
  if (method === 'OPTIONS') return;
  // public endpoints that don't require Authorization
  const publicPaths = [
    '/health',
    // user service public endpoints (proxied under /users/...)
    '/users/login',
    '/users/register',
    '/users/signup',
    '/users/forgot-password',
    // upstream may expose top-level /login and /register; allow proxied variants too
    '/login',
    '/register'
  ];
  if (publicPaths.some(p => raw === p || raw.startsWith(p + '/'))) return;

  const auth = request.headers['authorization'] || request.headers['Authorization'];
  if (!auth) return reply.status(401).send({ success: false, message: 'Missing Authorization header' });
  const parts = String(auth).split(' ');
  if (parts.length !== 2) return reply.status(401).send({ success: false, message: 'Invalid Authorization header' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    request.user = payload;
  } catch (e) {
    return reply.status(401).send({ statusCode: 401, intOpCode: 0, data: { message: 'Invalid token' } });
  }

  // Permission enforcement mapping: method + path regex -> required permission
  // Keep this list aligned with frontend PermissionService and available permissions JSON
  const permissionMap = [
    // Tickets
    { method: 'GET', path: /^\/tickets(?:$|\/.*)/, permission: 'ticket.read' },
    { method: 'GET', path: /^\/tickets\/(\d+)(?:$|\/.*)/, permission: 'ticket.read' },
    { method: 'POST', path: /^\/tickets(?:$|\/.*)/, permission: 'ticket.create' },
    { method: 'PATCH', path: /^\/tickets\/(\d+)\/status$/, permission: 'ticket.move', assignmentCheck: true },
    { method: 'PATCH', path: /^\/tickets\/(\d+)(?:$|\/.*)/, permission: 'ticket.update' },
    { method: 'DELETE', path: /^\/tickets\/(\d+)(?:$|\/.*)/, permission: 'ticket.delete' },

    // Groups
    { method: 'POST', path: /^\/groups(?:$|\/.*)/, permission: 'group.create' },
    { method: 'GET', path: /^\/groups(?:$|\/.*)/, permission: 'group.read' },
    { method: 'POST', path: /^\/groups\/(\d+)\/members$/, permission: 'group.join' },
    { method: 'DELETE', path: /^\/groups\/(\d+)\/members\/(\d+)(?:$|\/.*)/, permission: 'group.manage' },

    // Users (management) - keep lightweight, do not block /users/permissions which gateway uses internally
    { method: 'GET', path: /^\/users\/(?:\d+)\/permissions$/, permission: 'permission.read' },
    { method: 'PUT', path: /^\/users\/(?:\d+)\/permissions$/, permission: 'permission.manage' }
  ];

  // find matching rule, if any
  const matched = permissionMap.find(rule => rule.method === method && rule.path.test(raw));
  if (!matched) return; // no permission required by gateway

  // helper to fetch JSON from upstream (simple http/https GET)
  const fetchJson = (url, headers = {}) => new Promise((resolve, reject) => {
    try {
      const u = new URL(url);
      const client = u.protocol === 'https:' ? https : http;
      const opts = { hostname: u.hostname, port: u.port || (u.protocol === 'https:' ? 443 : 80), path: u.pathname + (u.search || ''), method: 'GET', headers };
      const req = client.request(opts, (res) => {
        let body = '';
        res.on('data', (c) => body += c.toString());
        res.on('end', () => {
          try { const parsed = JSON.parse(body || '{}'); resolve({ statusCode: res.statusCode || 200, body: parsed }); }
          catch (e) { resolve({ statusCode: res.statusCode || 200, body: body }); }
        });
      });
      req.on('error', (err) => reject(err));
      req.end();
    } catch (e) { reject(e); }
  });

  // get user permissions from user-service (current authenticated user)
  try {
    const userServiceBase = proxyTargets['/users'];
    const permsUrl = userServiceBase + '/users/permissions';
    const permRes = await fetchJson(permsUrl, { Authorization: `Bearer ${token}` });
    // normalize possible shapes: array, { value: [...] }, { data: [...] }, or universal schema { statusCode,intOpCode,data:{permissions: [...] }}
    let userPerms = [];
    const b = permRes.body;
    if (Array.isArray(b)) userPerms = b;
    else if (b && Array.isArray(b.value)) userPerms = b.value;
    else if (b && Array.isArray(b.data)) userPerms = b.data;
    else if (b && b.data && Array.isArray(b.data.permissions)) userPerms = b.data.permissions;
    else if (b && Array.isArray(b.items)) userPerms = b.items;
    else if (b && Array.isArray(b.permissions)) userPerms = b.permissions;
    // log for debugging
    request.log.info({ matched: matched.permission, receivedPerms: userPerms, tokenSub: request.user && (request.user.sub || request.user.id || request.user.userId) }, 'Permission check');
    // allow exact permission, manage-level for read operations, or system.admin
    const perm = matched.permission;
    const manageAlt = perm.endsWith('.read') ? perm.replace(/\.read$/, '.manage') : null;
    const hasPermission = userPerms.includes(perm) || (manageAlt && userPerms.includes(manageAlt)) || userPerms.includes('system.admin');
    if (!hasPermission) {
      request.log.info({ allowed: false }, 'Permission denied by gateway');
      return reply.status(403).send({ statusCode: 403, intOpCode: 0, data: { message: 'Forbidden' } });
    }
    request.log.info({ allowed: true }, 'Permission granted by gateway');

    // if assignmentCheck is required, verify ticket is assigned to requester
    if (matched.assignmentCheck) {
      const ticketId = (raw.match(matched.path) || [])[1];
      if (!ticketId) return reply.status(400).send({ statusCode: 400, intOpCode: 0, data: { message: 'Missing ticket id' } });
      const ticketServiceBase = proxyTargets['/tickets'];
      const ticketUrl = ticketServiceBase + `/tickets/${encodeURIComponent(ticketId)}`;
      const ticketRes = await fetchJson(ticketUrl, { Authorization: `Bearer ${token}` });
      const ticketBody = ticketRes.body || {};
      const ticketData = ticketBody.data || ticketBody;
      const assignee = ticketData && (ticketData.assignee_user_id || ticketData.assigned_to || ticketData.assignee || null);
      const requesterId = request.user && (request.user.sub || request.user.id || request.user.userId);
      if (assignee === null || assignee === undefined || Number(assignee) !== Number(requesterId)) {
        return reply.status(403).send({ statusCode: 403, intOpCode: 0, data: { message: 'Forbidden' } });
      }
    }
  } catch (e) {
    request.log.error({ err: e }, 'Permission check failed');
    return reply.status(500).send({ statusCode: 500, intOpCode: 0, data: { message: 'Permission check failed' } });
  }
});

// Intercept user permission updates with group scope and forward to group-service
fastify.post('/users/:id/permissions', async (request, reply) => {
  try {
    const uid = request.params.id;
    const body = request.body || {};
    // If payload carries group_id, treat as group-scoped permission and forward to group-service
    if (body.group_id) {
      const groupServiceBase = proxyTargets['/groups'];
      const url = groupServiceBase + `/groups/${encodeURIComponent(body.group_id)}/permissions`;
      const token = request.headers['authorization'] || request.headers['Authorization'] || '';
      const headers = token ? { Authorization: String(token) } : {};
      const payload = { user_id: uid, permission: body.permission };
      const res = await doRequest(url, 'POST', headers, payload);
      return reply.status(res.statusCode || 200).send(res.body || {});
    }
    // otherwise proxy to user service upstream (let proxy handle it)
  } catch (e) {
    request.log.error({ err: e }, 'failed to handle group-scoped permission post');
    return reply.status(500).send({ statusCode: 500, intOpCode: 0, data: { message: 'Upstream error' } });
  }
});

// Intercept delete permission with group scope
fastify.delete('/users/:id/permissions/:perm', async (request, reply) => {
  try {
    const uid = request.params.id;
    const perm = request.params.perm;
    // expect optional query group_id
    const gid = request.query && request.query.group_id ? request.query.group_id : null;
    if (gid) {
      const groupServiceBase = proxyTargets['/groups'];
      const url = groupServiceBase + `/groups/${encodeURIComponent(gid)}/permissions`;
      const token = request.headers['authorization'] || request.headers['Authorization'] || '';
      const headers = token ? { Authorization: String(token) } : {};
      const payload = { user_id: uid, permission: perm };
      const res = await doRequest(url, 'DELETE', headers, payload);
      return reply.status(res.statusCode || 200).send(res.body || {});
    }
  } catch (e) {
    request.log.error({ err: e }, 'failed to handle group-scoped permission delete');
    return reply.status(500).send({ statusCode: 500, intOpCode: 0, data: { message: 'Upstream error' } });
  }
});

// Health endpoint
fastify.get('/health', async (req, reply) => ({ status: 'ok' }));

// Proxy rules: route prefix -> target
const proxyTargets = {
  '/users': process.env.USER_SERVICE_URL || 'http://localhost:3001',
  '/groups': process.env.GROUP_SERVICE_URL || 'http://localhost:3003',
  '/tickets': process.env.TICKET_SERVICE_URL || 'http://localhost:3010'
};

// Register proxy for each prefix
// Manual proxy function using native http(s)
async function forward(request, reply, upstreamBase, prefix) {
  const rawUrl = request.raw.url || request.url || '/';
  // compute path to send to upstream, handling auth endpoints specially
  const after = rawUrl.startsWith(prefix) ? rawUrl.slice(prefix.length) : rawUrl;
  let path;
  if (!after || after === '/') {
    // request to '/users' -> forward '/users' to upstream
    path = prefix;
  } else if (after.startsWith('/login') || after.startsWith('/register') || after.startsWith('/forgot-password')) {
    // Map proxied auth endpoints to upstream auth paths.
    // Many dev servers expose auth at '/login' and '/register' (Fastify),
    // while NestJS exposes '/auth/login'. Prefer upstream '/login' to match
    // the Fastify server currently running locally.
    if (after.startsWith('/login')) path = '/login';
    else if (after.startsWith('/register')) path = '/register';
    else if (after.startsWith('/forgot-password')) path = '/forgot-password';
  } else {
    // preserve resource paths like '/users/31' -> forward '/users/31'
    path = prefix + after;
  }

  const targetUrl = new URL(upstreamBase + path);
  const isHttps = targetUrl.protocol === 'https:';
  const client = isHttps ? https : http;

  const options = {
    hostname: targetUrl.hostname,
    port: targetUrl.port || (isHttps ? 443 : 80),
    path: targetUrl.pathname + (targetUrl.search || ''),
    method: request.raw.method,
    headers: { ...request.headers }
  };
  // override host header
  options.headers.host = targetUrl.host;
  // remove any transfer-encoding header to avoid mismatch when we set content-length
  for (const h of Object.keys(options.headers)) {
    if (h.toLowerCase() === 'transfer-encoding' || h.toLowerCase() === 'content-length') {
      delete options.headers[h];
    }
  }
  // If Fastify already parsed the body (request.body), send it directly instead of piping raw stream
  let parsedBody = undefined;
  try {
    parsedBody = (request && request.body !== undefined) ? request.body : undefined;
  } catch (e) {
    parsedBody = undefined;
  }

  if (parsedBody !== undefined && parsedBody !== null) {
    // prepare body string and adjust content-length
    let bodyStr;
    if (typeof parsedBody === 'string' || Buffer.isBuffer(parsedBody)) {
      bodyStr = parsedBody;
    } else {
      try { bodyStr = JSON.stringify(parsedBody); } catch (e) { bodyStr = String(parsedBody); }
    }
    options.headers['content-length'] = Buffer.byteLength(bodyStr);
    const proxReq = client.request(options, (proxRes) => {
      const ct = String(proxRes.headers['content-type'] || '');
      if (ct.includes('application/json')) {
        // buffer JSON and wrap if needed
        let body = '';
        proxRes.on('data', (c) => body += c.toString());
        proxRes.on('end', () => {
          try {
            const parsed = JSON.parse(body || '{}');
            // if upstream already uses the universal schema, forward as-is
            if (parsed && typeof parsed === 'object') {
              if (parsed.statusCode && Object.prototype.hasOwnProperty.call(parsed, 'intOpCode')) {
                reply.status(proxRes.statusCode || 200).send(parsed);
                return;
              }
              // if upstream already uses public API shape { success, data }, forward as-is
              if (Object.prototype.hasOwnProperty.call(parsed, 'success') && Object.prototype.hasOwnProperty.call(parsed, 'data')) {
                reply.status(proxRes.statusCode || 200).send(parsed);
                return;
              }
            }
            reply.status(proxRes.statusCode || 200).send({ statusCode: proxRes.statusCode || 200, intOpCode: 0, data: parsed });
          } catch (e) {
            // non-JSON body despite content-type; stream raw
            reply.raw.writeHead(proxRes.statusCode || 502, proxRes.headers);
            reply.raw.end(body);
          }
        });
        proxRes.on('error', (err) => { request.log.error({ err }, 'proxy response error'); reply.status(502).send({ statusCode: 502, intOpCode: 0, data: { message: 'Upstream error' } }); });
      } else {
        // non-JSON -> stream through
        reply.raw.writeHead(proxRes.statusCode || 502, proxRes.headers);
        pipeline(proxRes, reply.raw, (err) => {
          if (err) request.log.error({ err }, 'proxy response pipeline error');
        });
      }
    });
    proxReq.on('error', (err) => { request.log.error({ err }, 'proxy request error'); });
    proxReq.end(bodyStr);
  } else {
    const proxReq = client.request(options, (proxRes) => {
      const ct = String(proxRes.headers['content-type'] || '');
      if (ct.includes('application/json')) {
        let body = '';
        proxRes.on('data', (c) => body += c.toString());
        proxRes.on('end', () => {
          try {
            const parsed = JSON.parse(body || '{}');
            if (parsed && typeof parsed === 'object') {
              if (parsed.statusCode && Object.prototype.hasOwnProperty.call(parsed, 'intOpCode')) {
                reply.status(proxRes.statusCode || 200).send(parsed);
                return;
              }
              if (Object.prototype.hasOwnProperty.call(parsed, 'success') && Object.prototype.hasOwnProperty.call(parsed, 'data')) {
                reply.status(proxRes.statusCode || 200).send(parsed);
                return;
              }
            }
            reply.status(proxRes.statusCode || 200).send({ statusCode: proxRes.statusCode || 200, intOpCode: 0, data: parsed });
          } catch (e) {
            reply.raw.writeHead(proxRes.statusCode || 502, proxRes.headers);
            reply.raw.end(body);
          }
        });
        proxRes.on('error', (err) => { request.log.error({ err }, 'proxy response error'); reply.status(502).send({ statusCode: 502, intOpCode: 0, data: { message: 'Upstream error' } }); });
      } else {
        reply.raw.writeHead(proxRes.statusCode || 502, proxRes.headers);
        pipeline(proxRes, reply.raw, (err) => {
          if (err) {
            request.log.error({ err }, 'proxy response pipeline error');
          }
        });
      }
    });

    pipeline(request.raw, proxReq, (err) => {
      if (err) {
        request.log.error({ err }, 'proxy request pipeline error');
        try { proxReq.end(); } catch (e) {}
      }
    });
  }

  // indicate reply will be handled via raw stream
  return reply;
}

// Register routes that forward to upstreams
for (const prefix of Object.keys(proxyTargets)) {
  const upstream = proxyTargets[prefix];
  fastify.all(prefix, async (request, reply) => forward(request, reply, upstream, prefix));
  fastify.all(`${prefix}/*`, async (request, reply) => forward(request, reply, upstream, prefix));
}

const PORT = Number(process.env.PORT || 3000);
fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`API Gateway listening at ${address}`);
});
