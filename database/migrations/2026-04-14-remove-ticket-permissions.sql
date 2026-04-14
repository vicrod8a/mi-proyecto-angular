BEGIN;

-- Lista de permisos ticket.* a eliminar
-- Esta migración realiza borrados solo si las tablas existen, para evitar errores 42P01
-- (relation does not exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'role_permissions') THEN
    DELETE FROM public.role_permissions
    WHERE permission_id IN (
      SELECT id FROM public.permissions WHERE name IN ('ticket.create','ticket.read','ticket.update','ticket.delete','ticket.move')
    );
  END IF;
END$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_permissions') THEN
    DELETE FROM public.user_permissions
    WHERE permission_id IN (
      SELECT id FROM public.permissions WHERE name IN ('ticket.create','ticket.read','ticket.update','ticket.delete','ticket.move')
    );
  END IF;
END$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'permisos_grupo') THEN
    DELETE FROM public.permisos_grupo
    WHERE permission IN ('ticket.create','ticket.read','ticket.update','ticket.delete','ticket.move');
  END IF;
END$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'permissions') THEN
    DELETE FROM public.permissions
    WHERE name IN ('ticket.create','ticket.read','ticket.update','ticket.delete','ticket.move');
  END IF;
END$$;

COMMIT;

-- IMPORTANT: Haz un backup de la base de datos antes de ejecutar esta migración.
-- Ejecuta con psql o supabase CLI, por ejemplo:
-- psql "postgres://USER:PASS@HOST:PORT/DBNAME" -f database/migrations/2026-04-14-remove-ticket-permissions.sql
-- o con Supabase CLI:
-- supabase db query < database/migrations/2026-04-14-remove-ticket-permissions.sql
