-- ========================================
-- USUARIOS

-- Crear usuario
INSERT INTO users (username, email, password_hash, first_name, last_name, role)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, username, email, first_name, last_name, role, created_at;

-- Obtener usuario por email
SELECT * FROM users 
WHERE email = $1;

-- Obtener usuario por username
SELECT * FROM users 
WHERE username = $1;

-- Obtener usuario por ID
SELECT id, username, email, first_name, last_name, avatar_url, phone, address, birth_date, role, is_active, created_at
FROM users 
WHERE id = $1;

-- Actualizar usuario
UPDATE users 
SET first_name = $1, last_name = $2, phone = $3, address = $4, birth_date = $5, avatar_url = $6, updated_at = CURRENT_TIMESTAMP
WHERE id = $7
RETURNING id, username, email, first_name, last_name;

-- Cambiar contraseña
UPDATE users 
SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2;

-- Obtener todos los usuarios (paginado)
SELECT id, username, email, first_name, last_name, role, is_active, created_at
FROM users
WHERE is_active = TRUE
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- Desactivar usuario
UPDATE users 
SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- ========================================
-- GRUPOS
-- ========================================

-- Crear grupo
INSERT INTO groups (name, description, invitation_code, created_by)
VALUES ($1, $2, $3, $4)
RETURNING id, name, description, invitation_code, created_by, created_at;

-- Obtener grupo por ID
SELECT * FROM groups 
WHERE id = $1;

-- Obtener grupo por código de invitación
SELECT * FROM groups 
WHERE invitation_code = $1;

-- Obtener todos los grupos del usuario
SELECT DISTINCT g.id, g.name, g.description, g.created_by, g.created_at, COUNT(gm.user_id) as member_count
FROM groups g
LEFT JOIN group_members gm ON g.id = gm.group_id
WHERE g.id IN (SELECT group_id FROM group_members WHERE user_id = $1)
   OR g.created_by = $1
GROUP BY g.id
ORDER BY g.created_at DESC;

-- Obtener todos los grupos públicos
SELECT g.id, g.name, g.description, g.created_by, g.created_at, COUNT(gm.user_id) as member_count
FROM groups g
LEFT JOIN group_members gm ON g.id = gm.group_id
GROUP BY g.id
ORDER BY g.created_at DESC
LIMIT $1 OFFSET $2;

-- Actualizar grupo
UPDATE groups 
SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
WHERE id = $3
RETURNING id, name, description;

-- Regenerar código de invitación
UPDATE groups 
SET invitation_code = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING invitation_code;

-- Obtener miembros del grupo
SELECT u.id, u.username, u.email, u.first_name, u.last_name, u.avatar_url, gm.role, gm.joined_at
FROM users u
JOIN group_members gm ON u.id = gm.user_id
WHERE gm.group_id = $1
ORDER BY gm.joined_at DESC;

-- Contar miembros del grupo
SELECT COUNT(*) as member_count
FROM group_members
WHERE group_id = $1;

-- ========================================
-- MEMBRESÍA EN GRUPOS
-- ========================================

-- Agregar usuario a grupo
INSERT INTO group_members (group_id, user_id, role)
VALUES ($1, $2, $3)
RETURNING id, group_id, user_id, role, joined_at;

-- Verificar si usuario es miembro del grupo
SELECT id FROM group_members
WHERE group_id = $1 AND user_id = $2;

-- Obtener rol del usuario en grupo
SELECT role FROM group_members
WHERE group_id = $1 AND user_id = $2;

-- Remover usuario del grupo
DELETE FROM group_members
WHERE group_id = $1 AND user_id = $2;

-- Cambiar rol del usuario en grupo
UPDATE group_members
SET role = $1
WHERE group_id = $2 AND user_id = $3
RETURNING role;

-- ========================================
-- TICKETS
-- ========================================

-- Crear ticket
INSERT INTO tickets (title, description, status, priority, assigned_to, group_id, creator_id, deadline)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING id, title, description, status, priority, assigned_to, group_id, creator_id, created_at, deadline;

-- Obtener ticket por ID
SELECT * FROM tickets
WHERE id = $1;

-- Obtener todos los tickets del grupo
SELECT t.id, t.title, t.description, t.status, t.priority, t.assigned_to, t.group_id, t.creator_id, t.created_at, t.updated_at, t.deadline,
       u.username as creator_name, a.username as assigned_to_name
FROM tickets t
LEFT JOIN users u ON t.creator_id = u.id
LEFT JOIN users a ON t.assigned_to = a.id
WHERE t.group_id = $1
ORDER BY t.created_at DESC
LIMIT $2 OFFSET $3;

-- Obtener tickets asignados al usuario
SELECT t.id, t.title, t.description, t.status, t.priority, t.group_id, t.creator_id, t.created_at, t.deadline,
       u.username as creator_name, g.name as group_name
FROM tickets t
LEFT JOIN users u ON t.creator_id = u.id
LEFT JOIN groups g ON t.group_id = g.id
WHERE t.assigned_to = $1
ORDER BY t.created_at DESC;

-- Obtener tickets por estado
SELECT t.id, t.title, t.description, t.status, t.priority, t.assigned_to, t.created_at,
       u.username as assigned_to_name
FROM tickets t
LEFT JOIN users u ON t.assigned_to = u.id
WHERE t.group_id = $1 AND t.status = $2
ORDER BY t.priority DESC, t.created_at DESC;

-- Obtener tickets por prioridad
SELECT t.id, t.title, t.description, t.status, t.priority, t.assigned_to, t.created_at,
       u.username as assigned_to_name
FROM tickets t
LEFT JOIN users u ON t.assigned_to = u.id
WHERE t.group_id = $1 AND t.priority = $2
ORDER BY t.created_at DESC;

-- Actualizar ticket
UPDATE tickets
SET title = $1, description = $2, status = $3, priority = $4, assigned_to = $5, deadline = $6, updated_at = CURRENT_TIMESTAMP
WHERE id = $7
RETURNING id, title, description, status, priority, assigned_to, deadline, updated_at;

-- Cambiar estado del ticket
UPDATE tickets
SET status = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING id, status, updated_at;

-- Asignar ticket a usuario
UPDATE tickets
SET assigned_to = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING id, assigned_to, updated_at;

-- Eliminar ticket
DELETE FROM tickets
WHERE id = $1;

-- Contar tickets por grupo
SELECT COUNT(*) as ticket_count
FROM tickets
WHERE group_id = $1;

-- Contar tickets por estado
SELECT status, COUNT(*) as count
FROM tickets
WHERE group_id = $1
GROUP BY status;

-- ========================================
-- COMENTARIOS EN TICKETS
-- ========================================

-- Crear comentario
INSERT INTO ticket_comments (ticket_id, user_id, text)
VALUES ($1, $2, $3)
RETURNING id, ticket_id, user_id, text, created_at;

-- Obtener comentarios del ticket
SELECT tc.id, tc.ticket_id, tc.user_id, tc.text, tc.created_at,
       u.username, u.avatar_url
FROM ticket_comments tc
LEFT JOIN users u ON tc.user_id = u.id
WHERE tc.ticket_id = $1
ORDER BY tc.created_at DESC;

-- Actualizar comentario
UPDATE ticket_comments
SET text = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING id, text, updated_at;

-- Eliminar comentario
DELETE FROM ticket_comments
WHERE id = $1;

-- Contar comentarios del ticket
SELECT COUNT(*) as comment_count
FROM ticket_comments
WHERE ticket_id = $1;

-- ========================================
-- HISTORIAL DE CAMBIOS
-- ========================================

-- Crear entrada de historial
INSERT INTO ticket_history (ticket_id, user_id, action, field, old_value, new_value)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, ticket_id, user_id, action, field, old_value, new_value, changed_at;

-- Obtener historial del ticket
SELECT th.id, th.ticket_id, th.user_id, th.action, th.field, th.old_value, th.new_value, th.changed_at,
       u.username, u.avatar_url
FROM ticket_history th
LEFT JOIN users u ON th.user_id = u.id
WHERE th.ticket_id = $1
ORDER BY th.changed_at DESC;

-- Obtener historial con filtro de fecha
SELECT th.id, th.ticket_id, th.user_id, th.action, th.field, th.old_value, th.new_value, th.changed_at,
       u.username
FROM ticket_history th
LEFT JOIN users u ON th.user_id = u.id
WHERE th.ticket_id = $1 AND th.changed_at BETWEEN $2 AND $3
ORDER BY th.changed_at DESC;

-- Obtener historial de cambios de campo específico
SELECT th.id, th.ticket_id, th.user_id, th.action, th.old_value, th.new_value, th.changed_at,
       u.username
FROM ticket_history th
LEFT JOIN users u ON th.user_id = u.id
WHERE th.ticket_id = $1 AND th.field = $2
ORDER BY th.changed_at DESC;

-- ========================================
-- PERMISOS Y ROLES
-- ========================================

-- Obtener permisos de un rol
SELECT p.name, p.description
FROM permissions p
JOIN role_permissions rp ON p.id = rp.permission_id
WHERE rp.role_id = (SELECT id FROM roles WHERE name = $1);

-- Obtener permisos del usuario
SELECT p.name
FROM permissions p
JOIN role_permissions rp ON p.id = rp.permission_id
WHERE rp.role_id = (SELECT role FROM users WHERE id = $1)::int;

-- Verificar si usuario tiene permiso
SELECT EXISTS(
  SELECT 1 FROM permissions p
  JOIN role_permissions rp ON p.id = rp.permission_id
  WHERE rp.role_id = (SELECT role FROM users WHERE id = $1)::int
  AND p.name = $2
);

-- ========================================
-- REPORTES Y ESTADÍSTICAS
-- ========================================

-- Tickets por usuario (creador)
SELECT u.id, u.username, u.first_name, COUNT(t.id) as ticket_count
FROM users u
LEFT JOIN tickets t ON u.id = t.creator_id
WHERE t.group_id = $1
GROUP BY u.id, u.username, u.first_name
ORDER BY ticket_count DESC;

-- Tickets por usuario (asignado)
SELECT u.id, u.username, u.first_name, COUNT(t.id) as assigned_count, 
       SUM(CASE WHEN t.status = 'Hecho' THEN 1 ELSE 0 END) as completed_count
FROM users u
LEFT JOIN tickets t ON u.id = t.assigned_to AND t.group_id = $1
GROUP BY u.id, u.username, u.first_name
ORDER BY assigned_count DESC;

-- Estadísticas del grupo
SELECT 
  COUNT(DISTINCT gm.user_id) as total_members,
  COUNT(DISTINCT t.id) as total_tickets,
  SUM(CASE WHEN t.status = 'Hecho' THEN 1 ELSE 0 END) as completed_tickets,
  SUM(CASE WHEN t.status = 'Pendiente' THEN 1 ELSE 0 END) as pending_tickets,
  SUM(CASE WHEN t.status = 'En progreso' THEN 1 ELSE 0 END) as in_progress_tickets
FROM groups g
LEFT JOIN group_members gm ON g.id = gm.group_id
LEFT JOIN tickets t ON g.id = t.group_id
WHERE g.id = $1;

-- Tickets por prioridad (grupo)
SELECT priority, COUNT(*) as count
FROM tickets
WHERE group_id = $1
GROUP BY priority
ORDER BY priority;

-- Actividad reciente en grupo
SELECT 'ticket_created' as type, t.id, t.title, t.created_at, u.username
FROM tickets t
LEFT JOIN users u ON t.creator_id = u.id
WHERE t.group_id = $1
UNION ALL
SELECT 'comment_added' as type, tc.id::text, tc.text, tc.created_at, u.username
FROM ticket_comments tc
LEFT JOIN tickets t ON tc.ticket_id = t.id
LEFT JOIN users u ON tc.user_id = u.id
WHERE t.group_id = $1
ORDER BY created_at DESC
LIMIT 20;

-- ========================================
-- BÚSQUEDAS
-- ========================================

-- Buscar tickets por título
SELECT id, title, description, status, priority, created_at
FROM tickets
WHERE group_id = $1 AND title ILIKE '%' || $2 || '%'
ORDER BY created_at DESC
LIMIT 20;

-- Buscar tickets por descripción
SELECT id, title, description, status, priority, created_at
FROM tickets
WHERE group_id = $1 AND description ILIKE '%' || $2 || '%'
ORDER BY created_at DESC
LIMIT 20;

-- Buscar usuarios por nombre
SELECT id, username, email, first_name, last_name
FROM users
WHERE (first_name ILIKE '%' || $1 || '%' OR last_name ILIKE '%' || $1 || '%' OR username ILIKE '%' || $1 || '%')
AND is_active = TRUE
LIMIT 10;

-- ========================================
-- UTILIDADES
-- ========================================

-- Obtener id autoincremental siguiente
SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users) + 1);

-- Limpiar datos de prueba (PELIGROSO - solo desarrollo)
-- DELETE FROM ticket_history;
-- DELETE FROM ticket_comments;
-- DELETE FROM tickets;
-- DELETE FROM group_members;
-- DELETE FROM groups;
-- DELETE FROM users;
