# API Gateway

Fastify-based API Gateway that validates JWT and proxies requests to microservices.

Environment variables:
- `PORT` - gateway port (default 3000)
- `JWT_SECRET` - secret used to verify tokens
- `USER_SERVICE_URL`, `GROUP_SERVICE_URL`, `TICKET_SERVICE_URL` - upstream service URLs

Start:

```bash
cd apigateway
npm install
npm start
```
