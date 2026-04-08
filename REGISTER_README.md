# Registro — Instrucciones y SQL

Archivo con todos los comandos, SQL y ejemplos para dejar funcionando el endpoint `POST /register`.

IMPORTANTE: nada de esto se ejecuta desde aquí — copia y pega en tu PowerShell o en el SQL editor de Supabase.

---

## 1) Reiniciar servidor Fastify (PowerShell)

Desde la raíz del proyecto:

```powershell
cd C:\Users\vicoe\mi-proyecto\user-service\user-service
# Setear variables de entorno (reemplaza valores)
$env:SUPABASE_URL = "https://TU_SUPABASE_URL"
$env:SUPABASE_KEY = "TU_SUPABASE_KEY"
# Arrancar servidor (ts-node)
npx ts-node src/fastify-server.ts
```

---

## 2) Payload exacto que envía el FRONT a `POST /register`

Pegar exactamente este JSON en Postman o en el fetch desde el frontend:

```json
{
  "username": "juan_test",
  "email": "juan_test@example.com",
  "password": "Password1",
  "fullName": "Juan Test",
  "address": "Calle Falsa 123",
  "phone": "+34 600 000 000",
  "birthDate": "1990-08-22"
}
```

El backend hará hash de `password` y guardará `password_hash` (o `password` según tu esquema). No envíes hashes desde el cliente.

---

## 3) SQL para crear/asegurar columnas e índices (pegar en Supabase SQL Editor)

```sql
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS username varchar(150),
ADD COLUMN IF NOT EXISTS first_name varchar(150),
ADD COLUMN IF NOT EXISTS last_name varchar(150),
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS phone varchar(50),
ADD COLUMN IF NOT EXISTS birthdate date,
ADD COLUMN IF NOT EXISTS password_hash varchar(255),
ADD COLUMN IF NOT EXISTS role varchar(50) DEFAULT 'user',
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON public.users((lower(email)));
CREATE UNIQUE INDEX IF NOT EXISTS users_username_idx ON public.users((lower(username)));
```

Si prefieres que el servidor escriba el hash en la columna `password` (si ya existe), usa la variante de INSERT más abajo y/o añade la columna `password`.

---

## 4) Verificar columnas en la BD

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;
```

---

## 5) Generar bcrypt hash localmente (Node.js)

Ejecuta en tu máquina para obtener un hash que puedas usar en un INSERT directo:

```bash
node -e "const b=require('bcryptjs');console.log(b.hashSync('Password1',10));"
```

---

## 6) INSERT que hace el BACKEND (ejemplo) — usar hash generado en Node o pgcrypto

Opción A — insertar hash generado por Node (reemplaza `HASH_GENERADO_AQUI`):

```sql
INSERT INTO public.users
  (username, email, first_name, last_name, address, phone, birthdate, password_hash, role, is_active, created_at)
VALUES
  (
    'juan_test',
    'juan_test@example.com',
    'Juan',
    'Test',
    'Calle Falsa 123',
    '+34 600 000 000',
    '1990-08-22',
    'HASH_GENERADO_AQUI',
    'user',
    true,
    now()
  );
```

Opción B — generar hash en la BD con `pgcrypto` (requiere permiso para crear extensión):

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO public.users
  (username, email, first_name, last_name, address, phone, birthdate, password_hash, role, is_active, created_at)
VALUES
  (
    'juan_test',
    'juan_test@example.com',
    'Juan',
    'Test',
    'Calle Falsa 123',
    '+34 600 000 000',
    '1990-08-22',
    crypt('Password1', gen_salt('bf', 10)),
    'user',
    true,
    now()
  );
```

---

## 7) Probar `POST /register` (curl y PowerShell)

curl:
```bash
curl -X POST http://127.0.0.1:3001/register \
  -H "Content-Type: application/json" \
  -d '{"username":"juan_test","email":"juan_test@example.com","password":"Password1","fullName":"Juan Test","address":"Calle Falsa 123","phone":"+34 600 000 000","birthDate":"1990-08-22"}'
```

PowerShell:
```powershell
Invoke-RestMethod -Method POST -Uri http://127.0.0.1:3001/register `
  -ContentType 'application/json' `
  -Body '{"username":"juan_test","email":"juan_test@example.com","password":"Password1","fullName":"Juan Test","address":"Calle Falsa 123","phone":"+34 600 000 000","birthDate":"1990-08-22"}'
```

---

## 8) Postman — crear request rápida

- Nuevo request → POST `http://127.0.0.1:3001/register`
- Headers: `Content-Type: application/json`
- Body → raw → pegar el JSON del apartado 2

---

## 9) Qué pegar aquí si falla (para que te ayude rápido)

- Respuesta JSON completa del cliente (Network → /register)
- Últimas ~30-40 líneas del log del servidor (donde aparezca `Supabase insert error` u otro error)
- Salida de la consulta de verificación de columnas (apartado 4)

---

## 10) Notas y recomendaciones

- En producción, no devuelvas detalles completos del error de la BD al cliente; solo muéstralos aquí mientras depuramos.
- Asegúrate de que las variables `SUPABASE_URL` y `SUPABASE_KEY` apunten al proyecto correcto.
- Si prefieres, generamos una colección Postman `.json` lista para importar.

---

Si quieres, agrego ahora la colección Postman y la guardo en el repo. ¿La hago?
