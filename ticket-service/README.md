Ticket service

Endpoints:
- GET /tickets?groupId=<groupId>
- GET /tickets/:id
- POST /tickets
- PUT /tickets/:id
- DELETE /tickets/:id

Run:

```bash
cd ticket-service
npm install
npm start
```

Auth: expects `Authorization: Bearer <jwt>`; JWT `sub` should be numeric user id matching `users.id` in supabase.
