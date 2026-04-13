const Fastify = require('fastify');
const http = require('http');
const https = require('https');
const { pipeline } = require('stream');
const { URL } = require('url');
const cors = require('@fastify/cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const fastify = Fastify({ logger: true });

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
    return reply.status(401).send({ success: false, message: 'Invalid token' });
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
    // requests like '/users/login' should map to upstream '/login'
    path = after;
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
      reply.raw.writeHead(proxRes.statusCode || 502, proxRes.headers);
      pipeline(proxRes, reply.raw, (err) => {
        if (err) request.log.error({ err }, 'proxy response pipeline error');
      });
    });
    proxReq.on('error', (err) => { request.log.error({ err }, 'proxy request error'); });
    proxReq.end(bodyStr);
  } else {
    const proxReq = client.request(options, (proxRes) => {
      // write response headers/status
      reply.raw.writeHead(proxRes.statusCode || 502, proxRes.headers);
      pipeline(proxRes, reply.raw, (err) => {
        if (err) {
          request.log.error({ err }, 'proxy response pipeline error');
        }
      });
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
