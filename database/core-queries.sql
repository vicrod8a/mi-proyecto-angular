

-- ========================================
-- 1. LOGIN
-- ========================================

-- Obtener usuario por email (para verificar contraseña)
-- Uso: SELECT * FROM users WHERE email = $1
SELECT id, username, email, password_hash, first_name, last_name, role, is_active
FROM users 
WHERE email = $1 AND is_active = TRUE;

-- Obtener usuario por username (para verificar contraseña)
-- Uso: SELECT * FROM users WHERE username = $1
SELECT id, username, email, password_hash, first_name, last_name, role, is_active
FROM users 
WHERE username = $1 AND is_active = TRUE;

-- ========================================
-- 2. REGISTER USER / CREATE USER
-- ========================================

-- Crear nuevo usuario
-- Uso: INSERT INTO users VALUES (...)
-- Retorna: usuario creado con todos los datos
INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active)
VALUES ($1, $2, $3, $4, $5, $6, TRUE)
RETURNING id, username, email, first_name, last_name, role, created_at;

-- Verificar si email ya existe
-- Uso: SELECT COUNT(*) as exists FROM users WHERE email = $1
SELECT COUNT(*) as exists
FROM users 
WHERE email = $1;

-- Verificar si username ya existe
-- Uso: SELECT COUNT(*) as exists FROM users WHERE username = $1
SELECT COUNT(*) as exists
FROM users 
WHERE username = $1;

-- ========================================
-- 3. UPDATE USER PROFILE
-- ========================================

-- Actualizar perfil del usuario
-- Actualiza: first_name, last_name, phone, address, birth_date, avatar_url
-- Uso: UPDATE users SET ... WHERE id = $7
UPDATE users 
SET 
  first_name = $1, 
  last_name = $2, 
  phone = $3, 
  address = $4, 
  birth_date = $5, 
  avatar_url = $6, 
  updated_at = CURRENT_TIMESTAMP
WHERE id = $7 AND is_active = TRUE
RETURNING id, username, email, first_name, last_name, phone, address, birth_date, avatar_url, updated_at;

-- Obtener perfil completo del usuario
-- Uso: SELECT * FROM users WHERE id = $1
SELECT 
  id, 
  username, 
  email, 
  first_name, 
  last_name, 
  avatar_url, 
  phone, 
  address, 
  birth_date, 
  role, 
  is_active, 
  created_at, 
  updated_at
FROM users 
WHERE id = $1 AND is_active = TRUE;

-- ========================================
-- 4. UPDATE PASSWORD
-- ========================================

-- Cambiar contraseña del usuario
-- Verificar contraseña anterior: SELECT password_hash FROM users WHERE id = $1
-- Actualizar: UPDATE users SET password_hash = $1 WHERE id = $2
UPDATE users 
SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2 AND is_active = TRUE
RETURNING id, username, email;

-- Obtener hash de contraseña actual (para verificación)
-- Uso: SELECT password_hash FROM users WHERE id = $1
SELECT password_hash
FROM users 
WHERE id = $1 AND is_active = TRUE;

-- ========================================
-- 5. ASSIGN PERMISSIONS
-- ========================================

-- Obtener rol del usuario
-- Uso: SELECT role FROM users WHERE id = $1
SELECT role
FROM users 
WHERE id = $1 AND is_active = TRUE;

-- Obtener todos los permisos de un rol
-- Uso: SELECT p.* FROM permissions p ... WHERE r.name = $1
SELECT DISTINCT p.id, p.name, p.description
FROM permissions p
JOIN role_permissions rp ON p.id = rp.permission_id
JOIN roles r ON rp.role_id = r.id
WHERE r.name = $1
ORDER BY p.name;

-- Verificar si usuario tiene un permiso específico
-- Uso: SELECT EXISTS(SELECT 1 FROM ...WHERE u.id = $1 AND p.name = $2)
SELECT EXISTS(
  SELECT 1 FROM permissions p
  JOIN role_permissions rp ON p.id = rp.permission_id
  JOIN roles r ON rp.role_id = r.id
  JOIN users u ON u.role = r.id::text
  WHERE u.id = $1 AND p.name = $2
);

-- Cambiar rol del usuario
-- Uso: UPDATE users SET role = $1 WHERE id = $2
UPDATE users
SET role = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2 AND is_active = TRUE
RETURNING id, username, email, role;

-- Obtener todos los roles disponibles
-- Uso: SELECT * FROM roles
SELECT id, name, description
FROM roles
ORDER BY name;

-- Obtener todos los permisos disponibles
-- Uso: SELECT * FROM permissions
SELECT id, name, description
FROM permissions
ORDER BY name;

-- Listar permisos de un rol específico
-- Uso: SELECT DISTINCT p.* FROM permissions p ... WHERE r.id = $1
SELECT DISTINCT p.id, p.name, p.description
FROM permissions p
JOIN role_permissions rp ON p.id = rp.permission_id
WHERE rp.role_id = $1
ORDER BY p.name;

-- ========================================
-- TABLAS DE REFERENCIA
-- ========================================

-- Ver todos los roles con sus permisos
SELECT 
  r.id, 
  r.name, 
  r.description,
  STRING_AGG(p.name, ', ') as permissions
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
LEFT JOIN permissions p ON rp.permission_id = p.id
GROUP BY r.id, r.name, r.description
ORDER BY r.name;

-- Ver todos los usuarios y sus roles
SELECT 
  u.id, 
  u.username, 
  u.email, 
  u.first_name, 
  u.last_name, 
  u.role,
  r.name as role_name,
  u.is_active, 
  u.created_at
FROM users u
LEFT JOIN roles r ON u.role = r.name
WHERE u.is_active = TRUE
ORDER BY u.created_at DESC;

-- Contar usuarios por rol
SELECT 
  r.name as role_name,
  COUNT(u.id) as user_count
FROM roles r
LEFT JOIN users u ON u.role = r.id::text AND u.is_active = TRUE
GROUP BY r.id, r.name
ORDER BY user_count DESC;
