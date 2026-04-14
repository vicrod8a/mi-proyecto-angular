-- Migration: Add `ticket.move` permission
-- Insert the permission if it doesn't exist
INSERT INTO public.permissions (name, description)
VALUES ('ticket.move', 'Mover tickets en vista Kanban')
ON CONFLICT (name) DO NOTHING;

-- Optional: assign this permission to an existing user (safe: picks first user if any)
-- This will do nothing when there are no users, avoiding FK violations.
WITH target_user AS (
  SELECT id AS uid FROM public.users ORDER BY id LIMIT 1
)
INSERT INTO public.user_permissions (user_id, permission_id)
SELECT t.uid, p.id
FROM public.permissions p
CROSS JOIN target_user t
WHERE p.name = 'ticket.move'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_permissions up WHERE up.user_id = t.uid AND up.permission_id = p.id
  );

-- Optional: preview the inserted permission
SELECT * FROM public.permissions WHERE name = 'ticket.move';
